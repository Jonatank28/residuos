import React, { useEffect } from "react";
import { AuthRoutes } from "../../../routes/routes";
import { IControllerAuth } from "../../../routes/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getParadasFromStorage, setParadasToStorage } from "../../../utils/paradas";

export interface ParamsTypes {
  screen: string;
  data?: ParadaTypes;
  osID?: number;
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
  const osId = params.osID;
  const [dataList, setDataList] = React.useState<ParadaTypes[]>([]);

  // Carregar dados do AsyncStorage ao iniciar
  useEffect(() => {
    const loadFromStorage = async () => {
      if (!osId) return;
      try {
        const storageData = await getParadasFromStorage(osId);
        if (storageData) {
          setDataList(JSON.parse(storageData));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage", error);
      }
    };

    loadFromStorage();
  }, [osId]);

  useEffect(() => {
    const saveToStorage = async () => {
      if (!osId) return;
      try {
        await setParadasToStorage(osId, dataList);
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage", error);
      }
    };

    saveToStorage();
  }, [dataList, osId]);

  const formatarData = (data: string) => {
    const dataObj = new Date(data);

    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataObj.getDate().toString().padStart(2, '0');

    const hora = dataObj.getHours().toString().padStart(2, '0');
    const minuto = dataObj.getMinutes().toString().padStart(2, '0');
    const segundo = dataObj.getSeconds().toString().padStart(2, '0');

    return {
      data: `${dia}/${mes}/${ano}`,
      hora: `${hora}:${minuto}:${segundo}`
    };
  };

  useEffect(() => {
    const paramsData = params.data;
    if (paramsData) {
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

  const navigateToAddStops = () =>
    navigation.navigate(AuthRoutes.AdicionarParadas, { screen: AuthRoutes.AdicionarParadas });

  const handleEdit = (item: ParadaTypes) =>
    navigation.navigate(AuthRoutes.AdicionarParadas, { screen: AuthRoutes.AdicionarParadas, data: item });

  const handleDelete = async (id: number) => {
    const updatedList = dataList.filter(item => item.id !== id);
    setDataList(updatedList);

    try {
      await AsyncStorage.setItem(`paradas_${osId}`, JSON.stringify(updatedList));
    } catch (error) {
      console.error("Erro ao excluir item no AsyncStorage", error);
    }
  };

  return {
    navigation,
    params,
    navigateToAddStops,
    dataList,
    handleEdit,
    handleDelete,
  };
}
