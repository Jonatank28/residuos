import * as React from 'react';
import { IEquipamento } from '../../../../core/domain/entities/equipamento';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.DetalhesDoEquipamentoLocal> { }

export default function Controller({ params }: Props) {
  const [equipamento, setEquipamento] = React.useState<IEquipamento>({});

  React.useEffect(() => {
    if (params.equipamento?.codigoContainer) {
      setEquipamento(params.equipamento);
    }
  }, [params.equipamento]);

  return {
    equipamento
  };
}
