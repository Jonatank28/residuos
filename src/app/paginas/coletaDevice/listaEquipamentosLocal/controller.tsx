import * as React from 'react';
import I18n from 'i18n-js';
import { useVSSnack } from 'vision-common';
import { IEquipamento } from '../../../../core/domain/entities/equipamento';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.ListaEquipamentosLocal> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const [equipamentos, setEquipamentos] = React.useState<IEquipamento[]>([]);
  const [equipamentosRemovidos, setEquipamentosRemovidos] = React.useState<IEquipamento[]>([]);

  const navigateToDetalhesEquipamentos = (equipamento: IEquipamento) => {
    if (equipamento?.codigoContainer) {
      navigation.navigate(
        AuthRoutes.DetalhesDoEquipamentoLocal,
        { equipamento }
      );
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.equipamentListLocal.invalidCode'),
      });
    }
  };

  React.useEffect(() => {
    if (params.equipamentos?.length > 0) {
      setEquipamentos(params.equipamentos);
    }
  }, [params.equipamentos]);

  React.useEffect(() => {
    if (params.equipamentosRetirados?.length > 0) {
      setEquipamentosRemovidos(params.equipamentosRetirados);
    }
  }, [params.equipamentosRetirados]);

  return {
    equipamentos,
    equipamentosRemovidos,
    navigateToDetalhesEquipamentos
  };
}
