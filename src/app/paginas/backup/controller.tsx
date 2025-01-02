import * as React from 'react';
import I18n from 'i18n-js';
import Presenter from './presenter';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Config from "react-native-config";
import { usePresenter, useVSSnack } from 'vision-common';
import { useLoading } from '../../contextos/loadingContexto';
import { IControllerAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';
import { useAuth } from '../../contextos/authContexto';

interface Props extends IControllerAuth<AuthRoutes.Backup> { }

export default function Controller({ navigation }: Props) {
  const presenter = usePresenter(() => new Presenter());
  const { dispatchLoading } = useLoading();
  const { urlServidor } = useAuth();
  const { dispatchSnack } = useVSSnack();
  const [servidor, setServidor] = React.useState<string>('');
  const [senha, setSenha] = React.useState<string>('');

  const pegarServidorBackup = async () => {
    const response = await presenter.getServidorBackup();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (String(response).length > 0) {
      setServidor(response);
    } else {
      setServidor(urlServidor);
    }
  };

  const openSharing = async () => {
    const response = await Sharing.isAvailableAsync();

    if (response) {
      await Sharing.shareAsync(`${FileSystem.documentDirectory}/SQLite/${Config.APP_DATABASE_V1_KEY}.db`, {
        dialogTitle: 'DB Backup',
      });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.backup.noShareService'),
      });
    }
  };

  const atualizarServidorBackup = async () => {
    const response = await presenter.setServidorBackup(servidor);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    }
  };

  const goBackFunction = async () => {
    if (servidor?.length > 0) {
      await atualizarServidorBackup();
    }

    navigation.goBack();
  };

  const fazerBackup = async () => {
    dispatchLoading({ type: 'open' });

    if (servidor?.length > 0) {
      await atualizarServidorBackup();
    }

    if (servidor && servidor.length > 0 && senha && senha.length > 0) {
      const formData: FormData = new FormData();
      const databaseFile = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}/SQLite/${Config.APP_DATABASE_V1_KEY}.db`,
      );

      if (databaseFile.exists) {
        formData.append('residuosDB', {
          uri: databaseFile.uri,
          type: 'database/bd',
          name: 'residuos',
        });

        const response = await presenter.fazerBackup(formData, servidor, senha);

        if (response instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: response.message,
          });
        } else {
          dispatchSnack({
            type: 'open',
            alertType: 'success',
            message: I18n.t('screens.backup.backupSuccess'),
          });
        }
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: I18n.t('screens.backup.noDatabase'),
        });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.backup.confirmData'),
      });
    }

    dispatchLoading({ type: 'close' });
  };

  React.useEffect(() => {
    pegarServidorBackup();
  }, []);

  return {
    servidor,
    senha,
    goBackFunction,
    setSenha,
    openSharing,
    setServidor,
    fazerBackup
  };
}
