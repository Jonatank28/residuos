import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParadaTypes } from '../paginas/paradas/listaParadas/Controller';

const deleteParadasFromStorage = async (id: number) => {
  try {
    await AsyncStorage.removeItem(`paradas_${id}`);
    console.log('parada com id', id, 'deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar item do AsyncStorage', error);
  }
};

const getParadasFromStorage = async (id: number) => {
  try {
    const paradas = await AsyncStorage.getItem(`paradas_${id}`);
    return paradas;
  } catch (error) {
    console.error('Erro ao carregar dados do AsyncStorage', error);
  }
};

const setParadasToStorage = async (id: number, paradas: ParadaTypes[]) => {
  try {
    await AsyncStorage.setItem(`paradas_${id}`, JSON.stringify(paradas));
    console.log('paradas armazenadas com sucesso');
  } catch (error) {
    console.error('Erro ao armazenar dados no AsyncStorage', error);
  }
};

export { deleteParadasFromStorage, getParadasFromStorage, setParadasToStorage };
