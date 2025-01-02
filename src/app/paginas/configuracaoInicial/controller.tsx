import * as React from 'react';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import I18n from 'i18n-js';
import Constants from 'expo-constants';
import { usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import RNRestart from 'react-native-restart';
import { IServidor } from '../../../core/domain/entities/servidor';
import { useAuth } from '../../contextos/authContexto';
import Presenter from './presenter';
import { useLoading } from '../../contextos/loadingContexto';
import { useUser } from '../../contextos/usuarioContexto';
import Config from "react-native-config";
import { IControllerApp } from '../../routes/types';
import { CommonRoutes } from '../../routes/routes';
import { useColeta } from '../../contextos/coletaContexto';
import { useOffline } from '../../contextos/offilineContexto';

interface Props extends IControllerApp<CommonRoutes.ConfiguracaoInicial> { }

export default function Controller({ navigation }: Props) {
  const { setUsuario, usuario } = useUser();
  const { placa } = useColeta();
  const { offline } = useOffline();
  const { setToken, logado, setServidor } = useAuth();
  const { dispatchAlert } = useVSAlert();
  const { dispatchLoading } = useLoading();
  const version = Constants?.manifest?.version ?? '-';
  const { dispatchSnack } = useVSSnack();
  const [ip, setIp] = React.useState<string>('');
  const [rota, setRota] = React.useState<string>('');
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [hasColetasPendentes, setHasColetasPendentes] = React.useState<boolean>(false);

  const openFile = async () => {
    try {
      dispatchLoading({ type: 'open' });

      const sqliteDirectory = `${FileSystem.documentDirectory}SQLite`;

      const { exists } = await FileSystem.getInfoAsync(
        sqliteDirectory,
      );

      if (!exists) {
        await FileSystem.makeDirectoryAsync(sqliteDirectory);
      }

      const pathToDownloadTo = `${sqliteDirectory}/${Config.APP_DATABASE_V1_KEY}.db`;

      const result: any = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      await FileSystem.copyAsync({
        from: result?.uri ?? '',
        to: pathToDownloadTo,
      });

      dispatchAlert({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.initialSetting.restorationSuccess'),
        onPressRight: () => RNRestart.Restart(),
      });
    } catch (e) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: I18n.t('screens.initialSetting.restorationError'),
      });
    } finally {
      dispatchLoading({ type: 'close' });
    }
  };

  const showRestauracaoAlert = () => dispatchAlert({
    type: 'open',
    alertType: 'confirm',
    message: I18n.t('screens.initialSetting.restorationMessage'),
    onPressRight: openFile,
  });

  const pegarServidor = async () => {
    const response = await presenter.pegarServidor();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      if (response && response?.ip && response.ip?.length > 0) {
        setIp(response.ip);
      }

      if (response && response?.rota && response.rota?.length > 0) {
        setRota(response.rota);
      }
    }
  };

  React.useEffect(() => {
    pegarServidor();
    verificarColetasPendentes();
  }, []);

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
      navigation.goBack();
    }

    dispatchLoading({ type: 'close' });
  };

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

  const gravarConfiguracaoInicial = async () => {
    if (ip?.length > 0 && rota?.length > 0) {
      const servidor: IServidor = {
        ip,
        rota,
      };

      const response = presenter.gravarServidor(servidor);

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (logado) {
        setServidor(servidor);
        deslogar();
      } else {
        setServidor(servidor);
        navigation.goBack();

        dispatchSnack({
          type: 'open',
          alertType: 'success',
          message: I18n.t('screens.initialSetting.settingOK'),
        });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('yup.vericationError'),
      });
    }
  };

  return {
    ip,
    rota,
    version,
    offline,
    hasColetasPendentes,
    setIp,
    setRota,
    showRestauracaoAlert,
    gravarConfiguracaoInicial,
  };
}
