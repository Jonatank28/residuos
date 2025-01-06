import { useEffect, useState } from "react";
import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";
import { useVSSnack } from "vision-common";

interface ParamsTypes {
  motivo?: {
    id: number;
    nome: string;
  };
  data: {
    dataFim: string;
    dataInicio: string;
    horaFim: string;
    horaInicio: string;
    id: number;
    motivo: string;
    motivoId: number;
    observacao: string;
  };
  screen: string;
}


interface Props extends IControllerAuth<AuthRoutes.AdicionarParadas> {
  params: ParamsTypes;
}

export default function Controller({ navigation, params }: Props) {
  const [observacao, setObservacao] = useState<string>('');
  const { dispatchSnack } = useVSSnack();
  const [motivo, setMotivo] = useState({
    id: 0,
    nome: '',
  });
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
    let currentDate = selectedDate || new Date();

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
    if (!motivo.id || motivo.id === 0) {
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

  console.log("horas", hour);

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

    const paramsDataList = params.data;

    const data = {
      id: paramsDataList ? paramsDataList.id : 0,
      dataFim: date.dataFinal,
      dataInicio: date.dataInicial,
      horaFim: hour.horaFinal,
      horaInicio: hour.horaInicial,
      motivo: motivo.nome,
      motivoId: motivo.id,
      observacao,
    };


    navigation.navigate<any>('/listaParadas', { data });
  };

  useEffect(() => {
    const paramsDataList = params.data;
    const paramsMotivo = params.motivo;

    if (paramsDataList && paramsMotivo) {
      setMotivo({
        id: paramsMotivo.id,
        nome: paramsMotivo.nome
      });
    }

    if (!paramsDataList && paramsMotivo) {
      setMotivo({
        id: paramsMotivo.id,
        nome: paramsMotivo.nome
      });
    }

    if (paramsDataList && !paramsMotivo) {
      setMotivo({
        id: paramsDataList.motivoId,
        nome: paramsDataList.motivo
      });
    }


    const formatarDataHora = (data: string, hora: string) => {
      const [dia, mes, ano] = data.split('/');
      return new Date(`${ano}-${mes}-${dia}T${hora}`);
    };

    const formatarHora = (hora: string) => {
      const [horas, minutos] = hora.split(':').map((valor) => parseInt(valor));

      const data = new Date(1970, 0, 1, horas, minutos);

      data.setHours(data.getHours());

      return data;
    };


    if (paramsDataList) {
      setObservacao(paramsDataList.observacao);

      setDate((prev) => ({
        ...prev,
        dataInicial: formatarDataHora(paramsDataList.dataInicio, paramsDataList.horaInicio),
      }));

      setDate((prev) => ({
        ...prev,
        dataFinal: formatarDataHora(paramsDataList.dataFim, paramsDataList.horaFim),
      }));

      setHour((prev) => ({
        ...prev,
        horaInicial: formatarHora(paramsDataList.horaInicio),
      }));

      setHour((prev) => ({
        ...prev,
        horaFinal: formatarHora(paramsDataList.horaFim),
      }));
    }
  }, [params, params.data]);


  return {
    navigation,
    params,
    motivo,
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
