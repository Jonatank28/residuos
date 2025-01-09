import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParadaTypes } from '../paginas/paradas/listaParadas/Controller';

const deleteParadasFromStorage = async (id: number | string) => {
  if (!id) return;
  try {
    await AsyncStorage.removeItem(`paradas_${id}`);
    console.log('parada com id', id, 'deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar item do AsyncStorage', error);
  }
};

const getParadasFromStorage = async (id: number | string) => {
  if (!id) return;
  try {
    const paradas = await AsyncStorage.getItem(`paradas_${id}`);
    console.log('paradas carregadas com sucesso, com id:', id);
    return paradas;
  } catch (error) {
    console.error('Erro ao carregar dados do AsyncStorage', error);
  }
};

const setParadasToStorage = async (id: number | string, paradas: ParadaTypes[]) => {
  if (!id) return;
  try {
    await AsyncStorage.setItem(`paradas_${id}`, JSON.stringify(paradas));
    console.log('paradas armazenadas com sucesso com id:', id);
  } catch (error) {
    console.error('Erro ao armazenar dados no AsyncStorage', error);
  }
};

// todas as storage que começam com paradas_
const getParadasFromAllStorage = async () => {
  try {
    const paradas = await AsyncStorage.getAllKeys();
    const filteredParadas = paradas.filter(key => key.startsWith('paradas_'));
    console.log('todas as paradas', filteredParadas);
    return paradas;
  } catch (error) {
    console.error('Erro ao carregar dados do AsyncStorage', error);
  }
};

const deleteAllParadasFromStorage = async () => {
  try {
    // Obtém todas as chaves armazenadas
    const keys = await AsyncStorage.getAllKeys();

    // Filtra apenas as chaves que começam com "paradas_"
    const paradasKeys = keys.filter(key => key.startsWith('paradas_'));

    // Remove todas as chaves filtradas
    await AsyncStorage.multiRemove(paradasKeys);

    console.log('Todas as paradas foram deletadas com sucesso.');
  } catch (error) {
    console.error('Erro ao deletar as paradas do AsyncStorage:', error);
  }
};

export {
  deleteParadasFromStorage,
  getParadasFromStorage,
  setParadasToStorage,
  getParadasFromAllStorage,
  deleteAllParadasFromStorage,
};
