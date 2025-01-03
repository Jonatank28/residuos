import React, { useEffect } from "react";
import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";

export interface ParamsTypes {
  screen: string;
  data?: ParadaTypes;
}

export interface ParadaTypes {
  id: number;
  observacao: string;
  motivo: string;
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
}

interface Props extends IControllerAuth<AuthRoutes.ListaParadas> {
  params: ParamsTypes;
}

export default function Controller({ navigation, params }: Props) {
  const [dataList, setDataList] = React.useState<ParadaTypes[]>([
    {
      id: 1,
      observacao: 'Parada 1',
      motivo: "almoço",
      dataInicio: "02/01/2025",
      horaInicio: "13:00",
      dataFim: "02/01/2025",
      horaFim: "14:00"
    },
    {
      id: 2,
      observacao: 'Parada 2',
      motivo: "troca de pneu",
      dataInicio: "02/01/2025",
      horaInicio: "15:00",
      dataFim: "02/01/2025",
      horaFim: "18:00"
    }
  ]);

  useEffect(() => {
    const paramsData = params.data;

    if (paramsData) {
      function formatarData(data: string) {
        const dataObj = new Date(data);

        const ano = dataObj.getFullYear(); // 4 dígitos do ano
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Mês com 2 dígitos
        const dia = dataObj.getDate().toString().padStart(2, '0'); // Dia com 2 dígitos

        const hora = dataObj.getHours().toString().padStart(2, '0'); // Hora com 2 dígitos
        const minuto = dataObj.getMinutes().toString().padStart(2, '0'); // Minutos com 2 dígitos
        const segundo = dataObj.getSeconds().toString().padStart(2, '0'); // Segundos com 2 dígitos

        const dataFormatada = `${dia}/${mes}/${ano}`;
        const horaFormatada = `${hora}:${minuto}:${segundo}`;

        return {
          data: dataFormatada,
          hora: horaFormatada
        };
      }


      const formatData = {
        id: 1,
        observacao: paramsData.observacao,
        motivo: paramsData.motivo,
        dataInicio: formatarData(paramsData.dataInicio).data,
        horaInicio: formatarData(paramsData.horaInicio).hora,
        dataFim: formatarData(paramsData.dataFim).data,
        horaFim: formatarData(paramsData.horaFim).hora
      };

      setDataList([...dataList, formatData]);
    }

  }, [params.data, params]);


  const navigateToAddStops = () => navigation.navigate(AuthRoutes.AdicionarParadas, { screen: AuthRoutes.AdicionarParadas });

  return {
    navigation,
    params,
    navigateToAddStops,
    dataList
  };
}
