import * as React from 'react';
import {
  useVSAlert, useVSConnection, useVSSnack, useUpdates, usePresenter,
} from 'vision-common';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { useAuth } from '../../contextos/authContexto';
import { useLoading } from '../../contextos/loadingContexto';
import { useOffline } from '../../contextos/offilineContexto';
import { useUser } from '../../contextos/usuarioContexto';
import { useStorage } from '../../contextos/storageContexto';
import { AuthRoutes, CommonRoutes } from '../../routes/routes';
import { useColeta } from '../../contextos/coletaContexto';
import Constants from 'expo-constants';
import { IControllerAuth } from '../../routes/types';
import { DEVICE } from '../../../core/device/device';
import { auditar } from '../../../core/auditoriaHelper';

interface Props extends IControllerAuth<AuthRoutes.Configuracoes> { }

export default function Controller({ navigation }: Props) {
  const { setToken } = useAuth();
  const { usuario, setUsuario, configuracoes } = useUser();
  const { placa, setVeiculo } = useColeta();
  const storageContext = useStorage();
  const { dispatchSnack } = useVSSnack();
  const { verificarAtualizacoesApp } = useUpdates();
  const { offline, toogleOffline } = useOffline();
  const { dispatchAlert } = useVSAlert();
  const { connectionState } = useVSConnection();
  const { dispatchLoading } = useLoading();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const version = `${DEVICE.VERSION} (${Constants?.manifest?.build ?? ' '})`;
  const [versaoRest, setVersaoRest] = React.useState<string>();
  const [hasColetasPendentes, setHasColetasPendentes] = React.useState<boolean>(false);
  const [showPdfOrientacaoUso, setShowPdfOrientacaoUso] = React.useState<boolean>(false);

  const setModelColetasPendentes = () => setHasColetasPendentes(!hasColetasPendentes);

  const setModelShowPdfOrientacaoUso = () => setShowPdfOrientacaoUso(!showPdfOrientacaoUso);

  const verificarColetasPendentes = async () => {
    const response = await presenter.verificaColetasPendentesDevice(placa);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setHasColetasPendentes(!!(response && response !== 0));
    }
  };

  const setOffline = () => {
    toogleOffline(!offline);
  };

  const navigateToAlterarSenha = () => navigation.navigate(AuthRoutes.AlterarSenha);

  const navigateToMeusDados = () => navigation.navigate(AuthRoutes.MeusDados, { photo: {} });

  const navigateToAlterarServidor = () => navigation.navigate(CommonRoutes.ConfiguracaoInicial);

  const navigateToAlterarBalancas = () => navigation.navigate(AuthRoutes.ListaBalancasTCP, { screen: AuthRoutes.Configuracoes, ehEdicao: true });

  const navigateToAlterarPlaca = async () => {
    const hasOK = hasColetasPendentes || offline;

    if (hasOK) {
      dispatchAlert({
        type: 'open',
        alertType: 'info',
        message: offline
          ? I18n.t('screens.settings.locallyMessageError')
          : I18n.t('screens.settings.collectPendent'),
        onPressRight: () => undefined,
      });
    } else {
      navigation.navigate(AuthRoutes.AlterarPlaca, { isSelect: false, screen: '' });
    }
  };

  const navigateToBackup = () => navigation.navigate(AuthRoutes.Backup);

  const navigateToAlterarRegioes = () => {
    if (offline) {
      dispatchAlert({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.settings.locallyMessageError'),
        onPressRight: () => undefined,
      });
    } else {
      navigation.navigate(AuthRoutes.AdicionarRegioes, {
        isChange: true
      });
    }
  };

  const verificarAtualizacoes = async () => {
    dispatchLoading({ type: 'open' });

    const response = await verificarAtualizacoesApp();

    if (!response) {
      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: I18n.t('screens.settings.updateOK'),
      });
    }

    dispatchLoading({ type: 'close' });
  };

  const deslogar = async () => {
    dispatchLoading({ type: 'open' });

    const response = await presenter.deslogar();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setToken('');
      setUsuario(null);
      setVeiculo({});
    }

    dispatchLoading({ type: 'close' });
  };

  const pegarVersaoRest = async () => {
    const response = connectionState
      ? await presenter.pegarVersaoRest(configuracoes?.obrigarAtualizarSincronizacao ?? false)
      : await presenter.pegarVersaoRestDevice();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response?.length > 0) {
      setVersaoRest(response);
    }
  };

  React.useEffect(() => {
    pegarVersaoRest();
    verificarColetasPendentes();
  }, []);

  const verificarDeslogar = async () => {
    const hasOK = hasColetasPendentes || offline;

    if (hasOK) {
      dispatchAlert({
        type: 'open',
        alertType: 'info',
        message: offline
          ? I18n.t('screens.settings.locallyMessageError')
          : I18n.t('screens.settings.collectPendent'),
        onPressRight: () => undefined,
      });
    } else {
      dispatchAlert({
        type: 'open',
        alertType: 'confirm',
        message: I18n.t('logof'),
        textLeft: I18n.t('alerts.stay'),
        textRight: I18n.t('alerts.logof'),
        onPressRight: deslogar,
      });
    }
  };

  const executarSql = async (sql: string) => {
    const response = await presenter.executarSql(sql);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      auditar(`retorno SQL: ${JSON.stringify(response)}`, 'executarSql', 'info');
      console.log(response);
    }
  };

  return {
    version,
    offline,
    versaoRest,
    hasColetasPendentes,
    showPdfOrientacaoUso,
    configuracoes,
    deslogar,
    setOffline,
    navigateToBackup,
    verificarDeslogar,
    navigateToMeusDados,
    verificarAtualizacoes,
    navigateToAlterarSenha,
    navigateToAlterarServidor,
    navigateToAlterarBalancas,
    navigateToAlterarPlaca,
    setModelColetasPendentes,
    navigateToAlterarRegioes,
    setModelShowPdfOrientacaoUso,
    executarSql
  };
}
