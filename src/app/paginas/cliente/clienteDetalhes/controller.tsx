import * as React from 'react';
import I18n from 'i18n-js';
import { getConnection, usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import Presenter from './presenter';
import { ICliente } from '../../../../core/domain/entities/cliente';
import { useLoading } from '../../../contextos/loadingContexto';
import { useOffline } from '../../../contextos/offilineContexto';
import { AuthRoutes } from '../../../routes/routes';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { IControllerAuth } from '../../../routes/types';
import { useCheckin } from '../../../contextos/checkinContexto';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import database from '../../../../core/database';

interface Props extends IControllerAuth<AuthRoutes.DetalhesDoCliente> {}

export default function Controller({ navigation, params }: Props) {
  const { usuario } = useUser();
  const { offline } = useOffline();
  const { dispatchSnack } = useVSSnack();
  const { dispatchAlert } = useVSAlert();
  const { dispatchLoading } = useLoading();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { pegarPosicaoAtual, localizacao } = useLocation();
  const [cliente, setCliente] = React.useState<ICliente>({});
  const [checkIn, setCheckIn] = React.useState<number | null>();
  const [isCheckIn, setIsCheckIn] = React.useState<boolean>(false);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const { fazerCheckIn, fazerCheckOut, verificaClienteCheckIn } = useCheckin();

  const iClienteDeviceRepositorio: IDeviceClienteRepositorio = new DeviceClienteRepositorio(
    usuario?.codigo ?? 0,
    getConnection(database),
  );

  const verificaCheckIn = async (codigo?: number) => setIsCheckIn(codigo === params.clienteID);

  const verificaCheckAtivo = async () => {
    const response = await verificaClienteCheckIn(iClienteDeviceRepositorio);

    setCheckIn(response);
    verificaCheckIn(Number(response));
  };

  const navigateToContainers = () => navigation.navigate(AuthRoutes.ClienteContainers, { containers: cliente?.containers ?? [] });

  const navigateToClienteCheckIn = () => {
    if (checkIn && checkIn !== 0 && checkIn !== null) {
      navigation.navigate(AuthRoutes.DetalhesDoCliente, { clienteID: checkIn });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.clientDetails.clientInvalidCode'),
      });
    }
  };

  const pegarCliente = async () => {
    setLoadingData(true);

    const response = offline
      ? await presenter.pegarClienteDevice(params.clienteID)
      : await presenter.pegarCliente(params.clienteID);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response && response?.codigo) {
      setCliente(response);
    }

    setLoadingData(false);
  };

  React.useEffect(() => {
    if (params.clienteID && params.clienteID !== 0) {
      pegarCliente();
      pegarPosicaoAtual();
      verificaCheckAtivo();
    }
  }, [params.clienteID]);

  React.useEffect(() => {
    const verificaPermissoes = async () => {
      const response = await presenter.verificaPermisssoes();

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (!response) {
        await presenter.requisitaPermissao();
      }
    };

    verificaPermissoes();
    // verificaClienteCheckIn();
  }, []);

  const adicionarLocalizacao = async () => {
    dispatchLoading({ type: 'open' });

    if (localizacao && cliente?.codigo) {
      const response = await presenter.atualizarLocalizacaoCliente(localizacao, cliente.codigo);

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
          message: I18n.t('screens.clientDetails.localizationSuccess'),
        });
      }
    }

    dispatchLoading({ type: 'close' });
  };

  const fazerCheckInAsync = async () => {
    await fazerCheckIn(localizacao, cliente?.codigo ?? 0, offline, iClienteDeviceRepositorio);
    await verificaCheckAtivo();
  };

  const fazerCheckOutAsync = async (clienteID?: number | null) => {
    const codigoCliente = (clienteID ?? cliente?.codigo) ?? 0;

    await fazerCheckOut(localizacao, codigoCliente, offline, iClienteDeviceRepositorio);
    await verificaCheckAtivo();
  };

  const showLocationAlert = () =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.clientDetails.confirmLocalization'),
      onPressRight: adicionarLocalizacao,
    });

  return {
    cliente,
    checkIn,
    isCheckIn,
    loadingData,
    pegarCliente,
    fazerCheckInAsync,
    fazerCheckOutAsync,
    showLocationAlert,
    navigateToContainers,
    adicionarLocalizacao,
    navigateToClienteCheckIn,
  };
}
