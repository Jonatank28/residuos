import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";
import { MotivoParadaTypes } from ".";

interface Props extends IControllerAuth<AuthRoutes.AdicionarMotivoParadas> { }

export default function Controller({ navigation, params }: Props) {
  const navigateTo = (motivo: MotivoParadaTypes) => {
    navigation.navigate<any>('/adicionarParadas', { motivo: motivo });
  }


  return {
    navigation,
    params,
    navigateTo
  };
}