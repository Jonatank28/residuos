import * as React from 'react';
import { usePresenter, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IEstado } from '../../../core/domain/entities/estado';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';
import { useUser } from '../../contextos/usuarioContexto';
import { useOffline } from '../../contextos/offilineContexto';

interface Props extends IControllerAuth<AuthRoutes.ListaEstadosMTR> { }

export default function Controller({ navigation, params }: Props) {
  const { usuario } = useUser();
  const { offline } = useOffline();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { dispatchSnack } = useVSSnack();
  const [estados, setEstados] = React.useState<IEstado[]>([]);
  const [hasSinir, setHasSinir] = React.useState<boolean>(false);
  const [loadingData, setLoadingData] = React.useState<boolean>(false);

  const navigateToAddMtr = (estado?: IEstado, sinir?: boolean) => {
    if (params.screen) {
      navigation.navigate(AuthRoutes.AdicionarMTR, {
        estado: estado ?? {},
        hasSinir: sinir ?? false,
        screen: params.screen,
        scanData: ''
      });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.stateMtr.screenError'),
      });
    }
  };

  const pegarEstados = async () => {
    setLoadingData(true);

    const response = offline
      ? await presenter.pegarEstadosMtrDevice()
      : await presenter.pegarEstadosMtr();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message
      });
    } else if (params.mtrs && params.mtrs.length > 0) {
      const estados: IEstado[] = [];

      params.mtrs.map((mtr) => {
        if (mtr.hasSinir) setHasSinir(true);
        else if (mtr?.estado?.codigo) estados.push(mtr.estado);
      });

      const newEstados = response.filter(item => estados.find(item2 => item.codigo === item2.codigo) == undefined);

      setEstados(newEstados);
    } else {
      setEstados(response);
    }

    setLoadingData(false);
  };

  React.useEffect(() => {
    pegarEstados();
  }, []);

  return {
    estados,
    hasSinir,
    loadingData,
    navigateToAddMtr
  };
}
