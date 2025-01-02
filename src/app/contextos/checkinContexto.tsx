import I18n from 'i18n-js';
import React, { createContext, useContext } from 'react';
import { getAxiosConnection, getConnection, ILocation, useVSSnack } from 'vision-common';
import axiosClient from '../../core/axios';
import ClienteRepositorio from '../../core/data/repositories/clienteRepositorio';
import database from '../../core/database';
import DeviceLocalizacaoRepositorio from '../../core/device/repositories/localizacaoRepositorio';
import { IClienteRepositorio } from '../../core/domain/repositories/clienteRepositorio';
import { IDeviceClienteRepositorio } from '../../core/domain/repositories/device/clienteRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../core/domain/repositories/device/localizacaoRepositorio';
import CheckInClienteUseCase from '../../core/domain/usecases/checkInClienteUseCase';
import CheckOutClienteUseCase from '../../core/domain/usecases/checkOutClienteUseCase';
import GravarCheckInClienteDeviceUseCase from '../../core/domain/usecases/device/database/location/gravarCheckInClienteDeviceUseCase';
import GravarCheckOutClienteDeviceUseCase from '../../core/domain/usecases/device/database/location/gravarCheckOutClienteDeviceUseCase';
import VerificarCheckInAtivoDeviceUseCase from '../../core/domain/usecases/device/database/location/verificaCheckInAtivoDeviceUseCase';
import { useLoading } from './loadingContexto';

interface CheckinContextData {
  verificaClienteCheckIn: (iClienteDeviceRepositorio: IDeviceClienteRepositorio) => Promise<number | null | undefined>;
  fazerCheckOut: (
    localizacao: ILocation,
    clienteID: number,
    offline: boolean,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
  ) => Promise<void>;
  fazerCheckIn: (
    localizacao: ILocation,
    clienteID: number,
    offline: boolean,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
    codigoOS?: number,
  ) => Promise<boolean>;
}

type Props = { children?: React.ReactNode };

const CheckinContext = createContext<CheckinContextData>({} as CheckinContextData);

export const CheckinProvider: React.FC = ({ children }: Props) => {
  const { dispatchLoading } = useLoading();
  const { dispatchSnack } = useVSSnack();

  const _axiosConnection = getAxiosConnection(axiosClient);
  const _connection = getConnection(database);

  const iClienteRepositorio: IClienteRepositorio = new ClienteRepositorio(_axiosConnection);
  const iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio = new DeviceLocalizacaoRepositorio(_connection);

  const fazerCheckInDevice = async (
    clienteID: number,
    location: ILocation,
    xOnline: boolean,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
    codigoOs?: number,
  ) =>
    new GravarCheckInClienteDeviceUseCase(iClienteDeviceRepositorio, iLocalizacaoRepositorio).execute({
      clienteID,
      location,
      xOnline,
      codigoOs,
    });

  const fazerCheckOutDevice = async (
    clienteID: number,
    location: ILocation,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
  ) =>
    new GravarCheckOutClienteDeviceUseCase(iClienteDeviceRepositorio, iLocalizacaoRepositorio).execute({
      clienteID,
      location,
    });

  const verificaCheckInDevice = async (iClienteDeviceRepositorio: IDeviceClienteRepositorio) =>
    new VerificarCheckInAtivoDeviceUseCase(iClienteDeviceRepositorio).execute();

  const fazerCheckInAsync = async (
    location: ILocation,
    clienteID: number,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
    codigoOS?: number,
  ) =>
    new CheckInClienteUseCase(iClienteRepositorio, iClienteDeviceRepositorio, iLocalizacaoRepositorio).execute({
      location,
      clienteID,
      codigoOs: codigoOS,
    });

  const fazerCheckOutAsync = async (
    location: ILocation,
    clienteID: number,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
  ) =>
    new CheckOutClienteUseCase(iClienteRepositorio, iClienteDeviceRepositorio, iLocalizacaoRepositorio).execute({
      location,
      clienteID,
    });

  const fazerCheckIn = async (
    localizacao: ILocation,
    clienteID: number,
    offline: boolean,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
    codigoOS?: number,
  ) => {
    dispatchLoading({ type: 'open' });

    if (localizacao?.latitude && localizacao?.longitude) {
      const response = offline
        ? await fazerCheckInDevice(clienteID, localizacao, !offline, iClienteDeviceRepositorio, codigoOS)
        : await fazerCheckInAsync(localizacao, clienteID, iClienteDeviceRepositorio, codigoOS);

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
        dispatchLoading({ type: 'close' });
        return false;
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'success',
          message: I18n.t('screens.clientDetails.checkInSuccess'),
        });
      }

      dispatchLoading({ type: 'close' });
      return true;
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Não foi possivel pegar a localização atual',
      });
    }

    dispatchLoading({ type: 'close' });
    return false;
  };

  const fazerCheckOut = async (
    localizacao: ILocation,
    clienteID: number,
    offline: boolean,
    iClienteDeviceRepositorio: IDeviceClienteRepositorio,
  ) => {
    dispatchLoading({ type: 'open' });

    if (localizacao?.latitude && localizacao?.longitude) {
      const response = offline
        ? await fazerCheckOutDevice(clienteID, localizacao, iClienteDeviceRepositorio)
        : await fazerCheckOutAsync(localizacao, clienteID, iClienteDeviceRepositorio);

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
          message: I18n.t('screens.clientDetails.checkOutSuccess'),
        });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Não foi possivel pegar a localização atual',
      });
    }

    dispatchLoading({ type: 'close' });
  };

  const verificaClienteCheckIn = async (iClienteDeviceRepositorio: IDeviceClienteRepositorio) => {
    const response = await verificaCheckInDevice(iClienteDeviceRepositorio);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      return response && response !== 0 ? Number(response) : null;
    }
  };

  return (
    <CheckinContext.Provider value={{ verificaClienteCheckIn, fazerCheckOut, fazerCheckIn }}>{children}</CheckinContext.Provider>
  );
};

export const useCheckin = () => useContext(CheckinContext);
