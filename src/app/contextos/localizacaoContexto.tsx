import * as React from 'react';
import * as ExpoLocation from 'expo-location';
import * as ExpoDevice from 'expo-device';
import I18n from 'i18n-js';
import { getConnection, ILocalStorageConnection, ILocation, useVSSnack } from 'vision-common';
import { useTheme } from 'styled-components/native';
import { BACKGROUND_LOCATION_TASK } from '../../core/constants';
import DeviceLocalizacaoRepositorio from '../../core/device/repositories/localizacaoRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../core/domain/repositories/device/localizacaoRepositorio';
import PegarPosicaoAtualUseCase from '../../core/domain/usecases/device/pegarPosicaoAtualUseCase';
import SetCompartilharLocalizacaoUseCase from '../../core/domain/usecases/device/setCompartilharLocalizacaoUseCase';
import GetCompartilharLocalizacaoUseCase from '../../core/domain/usecases/device/getCompartilharLocalizacaoUseCase';
import { Platform } from 'react-native';
import database from '../../core/database';
import RequisitaPermissaoLocalizacaoUseCase from '../../core/domain/usecases/device/permissions/requisitaPermissaoLocalizacaoUseCase';
import VerificaPermissaoLocalizacaoUseCase from '../../core/domain/usecases/device/permissions/verificaPermissaoLocalizacaoUseCase';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';

interface LocalizacaoContextData {
  localizacao: ILocation;
  pegarPosicaoAtual(): Promise<undefined | null>;
  compartilharLocalizacaoUsuario(localizacao: string): Promise<void>;
  pararCompartilhamentoAtivo(): Promise<void>;
  verificaLocalizacao(): Promise<string | undefined>;
}

type Props = { children?: React.ReactNode };

const LocalizacaoContext = React.createContext<LocalizacaoContextData>({} as LocalizacaoContextData);

export const LocalizacaoProvider: React.FC = ({ children }: Props) => {
  const { primary } = useTheme();
  const { dispatchSnack } = useVSSnack();
  const connection = getConnection(database);
  const [localizacao, setLocalizacao] = React.useState<ILocation>({});
  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();
  const iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio = new DeviceLocalizacaoRepositorio(connection);

  const getLocalizacao = async () => new GetCompartilharLocalizacaoUseCase(iLocalStorageConnection).execute();

  const pegarLocalizacaoAtual = async () => new PegarPosicaoAtualUseCase(iLocalizacaoRepositorio).execute();

  const requisitaPermissao = async () => new RequisitaPermissaoLocalizacaoUseCase(iLocalizacaoRepositorio).execute();

  const verificaPermisssoes = async () => new VerificaPermissaoLocalizacaoUseCase(iLocalizacaoRepositorio).execute();

  const setCompartilharLocalizacao = async (codigoOS: string) =>
    new SetCompartilharLocalizacaoUseCase(iLocalStorageConnection).execute(codigoOS);

  const pegarPosicaoAtual = async () => {
    if (Platform.OS === 'android' && ExpoDevice.osVersion && Number(ExpoDevice.osVersion) < 8) {
      return null;
    }

    const response = await pegarLocalizacaoAtual();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response) {
      const { latitude, longitude } = response.coords;

      const latLng: ILocation = {
        latitude,
        longitude,
      };

      setLocalizacao(latLng);
    }
  };

  const verificaPermissoes = async () => {
    const response = await verificaPermisssoes();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (!response) {
      await requisitaPermissao();
    } else {
      await pegarPosicaoAtual();
    }
  };

  const compartilharLocalizacaoUsuario = async (codigoLocalizacao: string) => {
    const hasStartedLocation = await ExpoLocation.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

    if (hasStartedLocation) {
      await ExpoLocation.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      console.log('parou compartilhamento');
      await setCompartilharLocalizacao('');

      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectDetails.locationSharingStopMessage'),
      });
    } else {
      await ExpoLocation.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: ExpoLocation.Accuracy.High,
        activityType: ExpoLocation.ActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: true,
        timeInterval: 30 * 1000,
        distanceInterval: 5,
        foregroundService: {
          notificationTitle: I18n.t('locationTask.title'),
          notificationBody: I18n.t('locationTask.body'),
          notificationColor: primary,
        },
        pausesUpdatesAutomatically: false,
      });

      console.log('iniciou compartilhamento');
      await setCompartilharLocalizacao(codigoLocalizacao);

      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: I18n.t('screens.collectDetails.locationSharingStartMessage'),
      });
    }
  };

  const pararCompartilhamentoAtivo = async () => {
    const { granted } = await ExpoLocation.getForegroundPermissionsAsync();

    if (granted) {
      const hasStartedLocation = await ExpoLocation.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

      if (hasStartedLocation) {
        await ExpoLocation.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        await setCompartilharLocalizacao('');
        console.log('parou compartilhamento');
      }
    }
  };

  const verificaLocalizacao = async () => {
    const response = await getLocalizacao();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      return response;
    }
  };

  React.useEffect(() => {
    verificaPermissoes();
  }, []);

  return (
    <LocalizacaoContext.Provider
      value={{
        pegarPosicaoAtual,
        compartilharLocalizacaoUsuario,
        pararCompartilhamentoAtivo,
        verificaLocalizacao,
        localizacao,
      }}>
      {children}
    </LocalizacaoContext.Provider>
  );
};

export const useLocation = () => React.useContext(LocalizacaoContext);
