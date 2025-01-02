import * as React from 'react';
import { usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IRegiao } from '../../../core/domain/entities/regiao';
import { useUser } from '../../contextos/usuarioContexto';
import { useLoading } from '../../contextos/loadingContexto';
import { useStorage } from '../../contextos/storageContexto';
import { AuthRoutes } from '../../routes/routes';
import { useAuth } from '../../contextos/authContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { useIsFocused } from '@react-navigation/native';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.AdicionarRegioes> { }

export default function Controller({ navigation, params }: Props) {
  const presenter = usePresenter(() => new Presenter());
  const { usuario, setUsuario } = useUser();
  const { setToken } = useAuth();
  const isFocused = useIsFocused();
  const { setVeiculo, veiculo } = useColeta();
  const { dispatchAlert } = useVSAlert();
  const storageContext = useStorage();
  const { dispatchSnack } = useVSSnack();
  const { dispatchLoading } = useLoading();
  const [regioes, setRegioes] = React.useState<IRegiao[]>([]);
  const [loadingData, setLoadingData] = React.useState<boolean>(params.isChange ? true : false);

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
    }

    dispatchLoading({ type: 'close' });
  };

  const goBackFunction = () => {
    if (params.isChange) {
      navigation.goBack();
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

  const pegarRegioes = async () => {
    setLoadingData(true);

    const response = await presenter.getRegioes();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setRegioes(response);
    }

    setLoadingData(false);
  };

  const gravarRegioes = async () => {
    dispatchLoading({ type: 'open' });

    if ((regioes?.length > 0 || !usuario?.permiteCadastrarOrdemMobile) && (params?.veiculo?.placa || params.isChange)) {
      const responseRegioes = await presenter.setRegioes(regioes);

      if (responseRegioes instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: responseRegioes.message
        });
      } else if (!params.isChange) {
        const responsePlaca = await presenter.setVeiculo(veiculo);

        if (responsePlaca instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: responsePlaca.message
          });
        } else {
          navigation.navigate(AuthRoutes.Home);

          dispatchSnack({
            type: 'open',
            alertType: 'success',
            message: I18n.t('screens.addRegions.settingOK'),
          });
        }
      } else {
        await storageContext.gravarAuditoria({
          codigoRegistro: 0,
          descricao: 'Alterou configurações de regiões',
          rotina: 'Regiões',
          tipo: 'CONFIGURACOES',
        });

        navigation.navigate(AuthRoutes.Configuracoes);

        dispatchSnack({
          type: 'open',
          alertType: 'success',
          message: I18n.t('screens.addRegions.settingOK'),
        });
      }
    } else {
      if (!params?.veiculo?.placa) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.addRegions.requiredBoard'),
        });
      }

      if (regioes?.length === 0) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.addRegions.requiredRegions'),
        });
      }
    }

    dispatchLoading({ type: 'close' });
  };

  const removerRegiao = (regiaoSelecionada: IRegiao) => {
    const newRegioes = regioes?.filter((item: IRegiao) => item.codigo !== regiaoSelecionada.codigo);
    setRegioes(newRegioes);
  };

  const navigateToPlacas = () => navigation.navigate(AuthRoutes.AlterarPlaca, {
    screen: AuthRoutes.AdicionarRegioes,
    isSelect: true
  });

  const navigateToRegioes = () => navigation.navigate(AuthRoutes.Regioes, { regioes, isChange: params.isChange });

  React.useEffect(() => {
    if (params?.regiao && params.regiao?.codigo) {
      const hasRegiao = regioes?.findIndex((item) => {
        if (params?.regiao && params.regiao?.codigo) {
          return item?.codigo === params.regiao.codigo
        }
      });

      if (hasRegiao === -1) {
        setRegioes([...regioes, params.regiao]);
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.addRegions.regionExist', { region: params.regiao.descricao }),
        });
      }
    }
  }, [params?.regiao]);

  React.useEffect(() => {
    if (params?.isChange) {
      pegarRegioes();
    }
  }, [params?.isChange]);

  React.useEffect(() => {
    if (params?.veiculo && params.veiculo?.codigo) {
      setVeiculo(params.veiculo);
    }
  }, [params?.veiculo]);

  React.useEffect(() => {
    if (isFocused) {
      storageContext.gravarAuditoria({
        codigoRegistro: 0,
        descricao: 'Acessou Tela de Regiões',
        rotina: 'Regiões',
        tipo: 'CONFIGURACOES',
      });
    }
  }, [isFocused]);

  return {
    veiculo,
    regioes,
    usuario,
    loadingData,
    goBackFunction,
    deslogar,
    removerRegiao,
    gravarRegioes,
    navigateToRegioes,
    navigateToPlacas
  };
}
