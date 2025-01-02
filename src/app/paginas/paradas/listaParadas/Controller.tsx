import { useState } from "react";
import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";

interface Props extends IControllerAuth<AuthRoutes.ListaParadas> { }

export default function Controller({ navigation, params }: Props) {


  const navigateToAddStops = () => navigation.navigate(AuthRoutes.AdicionarParadas, { screen: AuthRoutes.AdicionarParadas });

  return {
    navigation,
    params,
    navigateToAddStops,
  };
}