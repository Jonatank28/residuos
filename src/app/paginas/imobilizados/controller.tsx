import * as React from 'react';
import { usePresenter, useVSSnack } from 'vision-common';
import Presenter from './presenter';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';
import { IControllerAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';

interface Props extends IControllerAuth<AuthRoutes.Imobilizados> { }

export default function Controller({ params }: Props) {
  const presenter = usePresenter(() => new Presenter());
  const { dispatchSnack } = useVSSnack();
  const [imobilizados, setImobilizados] = React.useState<IImobilizado[]>([]);

  const pegarImobilizadosAgendados = async () => {
    const response = await presenter.pegarImobilizados(params.codigosOS);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setImobilizados(response);
    }
  };

  React.useEffect(() => {
    if (params.codigosOS) {
      pegarImobilizadosAgendados();
    }
  }, [params.codigosOS]);

  return {
    imobilizados
  };
}
