import * as React from 'react';
import { IResiduo } from '../../../../core/domain/entities/residuo';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.ListaResiduosLocal> { }

export default function Controller({ navigation, params }: Props) {
  const [residuos, setResiduos] = React.useState<IResiduo[]>([]);

  const navigateToDetalhesResiduo = (residuo: IResiduo) => navigation.navigate(AuthRoutes.DetalhesDoResiduoLocal, {
    residuo
  });

  React.useEffect(() => {
    if (params?.residuos && params.residuos.length > 0) {
      setResiduos(params.residuos);
    }
  }, [params?.residuos]);

  return {
    residuos,
    navigateToDetalhesResiduo,
  };
}
