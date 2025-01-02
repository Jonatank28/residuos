import * as React from 'react';
import { usePresenter, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import { IMotivo } from '../../../core/domain/entities/motivo';
import Presenter from './presenter';
import { useOffline } from '../../contextos/offilineContexto';
import { useUser } from '../../contextos/usuarioContexto';
import { IControllerAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';

interface Props extends IControllerAuth<AuthRoutes.Motivos> { }

export default function Controller({ navigation, params }: Props) {
  const { usuario } = useUser();
  const { offline } = useOffline();
  const { dispatchSnack } = useVSSnack();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [motivos, setMotivos] = React.useState<IMotivo[]>([]);

  const pegarMotivos = async () => {
    setLoadingData(true);

    const response = offline
      ? await presenter.pegarMotivosDevice()
      : await presenter.pegarMotivos();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response) {
      setMotivos(response);
    }

    setLoadingData(false);
  };

  const onSelectVeiculo = async (motivo: IMotivo) => {
    if (motivo.codigo && params.screen) {
      navigation.navigate<any>(params.screen, { motivo });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.reasons.selectReasonError'),
      });
    }
  };

  React.useEffect(() => {
    pegarMotivos();
  }, []);

  return {
    motivos,
    loadingData,
    onSelectVeiculo
  };
}
