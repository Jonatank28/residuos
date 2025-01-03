import { useState } from "react";
import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";
import { useVSSnack } from "vision-common";

interface ParamsTypes {
  motivo?: {
    id: number;
    nome: string;
  };
  screen: string;
}

interface Props extends IControllerAuth<AuthRoutes.AdicionarParadas> {
  params: ParamsTypes;
}

export default function Controller({ navigation, params }: Props) {
  const [observacao, setObservacao] = useState<string>('');
  const { dispatchSnack } = useVSSnack();
  const [date, setDate] = useState({
    dataInicial: new Date(),
    dataFinal: new Date(),
  });
  const [hour, setHour] = useState({
    horaInicial: new Date(),
    horaFinal: new Date(),
  });

  const [show, setShow] = useState<null | 'dataInicial' | 'dataFinal' | 'horaInicial' | 'horaFinal'>(null);

  const navigateToAddCategory = () =>
    navigation.navigate(AuthRoutes.AdicionarMotivoParadas, { screen: AuthRoutes.AdicionarMotivoParadas });

  const onChange = (event: any, selectedDate: any) => {
    setShow(null);
    const currentDate = selectedDate || new Date();

    if (show === 'dataInicial') {
      setDate((prev) => ({ ...prev, dataInicial: currentDate }));
    } else if (show === 'dataFinal') {
      setDate((prev) => ({ ...prev, dataFinal: currentDate }));
    } else if (show === 'horaInicial') {
      setHour((prev) => ({ ...prev, horaInicial: currentDate }));
    } else if (show === 'horaFinal') {
      setHour((prev) => ({ ...prev, horaFinal: currentDate }));
    }

    setShow(null);
  };



  const showPicker = (type: 'dataInicial' | 'dataFinal' | 'horaInicial' | 'horaFinal') => {
    setShow(type);
  };

  const checksValidDate = () => {
    if (!date.dataInicial || !date.dataFinal) {
      return { isValid: false, message: "Datas inicial e final são obrigatórias." };
    }

    if (!hour.horaInicial || !hour.horaFinal) {
      return { isValid: false, message: "Horas inicial e final são obrigatórias." };
    }

    if (new Date(date.dataFinal) < new Date(date.dataInicial)) {
      return { isValid: false, message: "Data final deve ser igual ou maior que a data inicial." };
    }

    if (new Date(date.dataFinal).getTime() === new Date(date.dataInicial).getTime() && hour.horaFinal < hour.horaInicial) {
      return { isValid: false, message: "Hora final deve ser igual ou maior que a hora inicial se as datas forem iguais." };
    }

    return { isValid: true, message: "Campos válidos." };
  };

  const checkValidateFields = () => {
    if (!params.motivo) {
      return { isValid: false, message: "Motivo de parada é obrigatório." };
    }
    return { isValid: true, message: "Campos válidos." };
  };

  const checkValidate = () => {
    const dateValidation = checksValidDate();
    const fieldsValidation = checkValidateFields();

    if (!dateValidation.isValid) {
      return { isValid: false, message: dateValidation.message };
    }

    if (!fieldsValidation.isValid) {
      return { isValid: false, message: fieldsValidation.message };
    }

    return { isValid: true, message: "Tudo certo!" };
  };

  const navigateTo = () => {
    const validation = checkValidate();

    if (!validation.isValid) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: validation.message
      });
      return;
    }

    const data = {
      dataInicio: date.dataInicial,
      dataFim: date.dataFinal,
      horaInicio: hour.horaInicial,
      horaFim: hour.horaFinal,
      motivo: params.motivo?.nome,
      motivoId: params.motivo?.id,
      observacao
    };

    navigation.navigate<any>('/listaParadas', { data });
  };

  return {
    navigation,
    params,
    show,
    setShow,
    showPicker,
    onChange,
    date,
    hour,
    observacao,
    setObservacao,
    navigateTo,
    navigateToAddCategory
  };
}
