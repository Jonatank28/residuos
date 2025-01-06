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
  motivoId: number;
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
      motivoId: 1,
      dataInicio: "02/01/2025",
      horaInicio: "13:00",
      dataFim: "02/01/2025",
      horaFim: "14:00"
    },
    {
      id: 2,
      observacao: 'Parada 2',
      motivo: "troca de pneu",
      motivoId: 2,
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

        const ano = dataObj.getFullYear();
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
        const dia = dataObj.getDate().toString().padStart(2, '0');

        const hora = dataObj.getHours().toString().padStart(2, '0');
        const minuto = dataObj.getMinutes().toString().padStart(2, '0');
        const segundo = dataObj.getSeconds().toString().padStart(2, '0');

        const dataFormatada = `${dia}/${mes}/${ano}`;
        const horaFormatada = `${hora}:${minuto}:${segundo}`;

        return {
          data: dataFormatada,
          hora: horaFormatada
        };
      }


      const verifyExist = dataList.some(item => item.id === paramsData.id);

      const data = {
        id: paramsData.id,
        observacao: paramsData.observacao,
        motivo: paramsData.motivo,
        motivoId: paramsData.motivoId,
        dataInicio: formatarData(paramsData.dataInicio).data,
        horaInicio: formatarData(paramsData.horaInicio).hora,
        dataFim: formatarData(paramsData.dataFim).data,
        horaFim: formatarData(paramsData.horaFim).hora
      };

      if (!verifyExist) {
        setDataList([...dataList, data]);
      } else {
        setDataList(dataList.map(item => item.id === paramsData.id ? data : item));
      }
    }
  }, [params, params.data]);



  const navigateToAddStops = () => navigation.navigate(AuthRoutes.AdicionarParadas, { screen: AuthRoutes.AdicionarParadas });


  const handleEdit = (item: ParadaTypes) => navigation.navigate(AuthRoutes.AdicionarParadas, { screen: AuthRoutes.AdicionarParadas, data: item });

  const handleDelete = (id: number) => setDataList(dataList.filter(item => item.id !== id));

  return {
    navigation,
    params,
    navigateToAddStops,
    dataList,
    handleEdit,
    handleDelete,
  };
}
