import { useState } from "react";
import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";

interface Props extends IControllerAuth<AuthRoutes.AdicionarParadas> { }

export default function Controller({ navigation, params }: Props) {
  const [observacao, setObservacao] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');
  const [date, setDate] = useState({
    dataInicial: '',
    dataFinal: '',
  });
  const [hour, setHour] = useState({
    horaInicial: '',
    horaFinal: '',
  })

  const [show, setShow] = useState<null | 'dataInicial' | 'dataFinal' | 'horaInicial' | 'horaFinal'>(null);

  // const navigateToAddCategory = () => navigation.navigate(AuthRoutes.MotivosParada, { screen: AuthRoutes.MotivosParada });
  const navigateToAddCategory = () => navigation.navigate(AuthRoutes.ListaParadas, { screen: AuthRoutes.ListaParadas });


  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date();

    switch (show) {
      case 'dataInicial':
        setDate((prev) => ({ ...prev, dataInicial: currentDate }));
        break;
      case 'dataFinal':
        setDate((prev) => ({ ...prev, dataFinal: currentDate }));
        break;
      case 'horaInicial':
        setHour((prev) => ({ ...prev, horaInicial: currentDate }));
        break;
      case 'horaFinal':
        setHour((prev) => ({ ...prev, horaFinal: currentDate }));
        break;
      default:
        break;
    }

    setShow(null);
  };

  const showPicker = (type: 'dataInicial' | 'dataFinal' | 'horaInicial' | 'horaFinal') => {
    setShow(type);
  };

  const navigateTo = () => {

  }

  return {
    navigation,
    params,
    show,
    showPicker,
    onChange,
    date,
    hour,
    observacao,
    setObservacao,
    motivo,
    setMotivo,
    navigateTo,
    navigateToAddCategory
  };
}