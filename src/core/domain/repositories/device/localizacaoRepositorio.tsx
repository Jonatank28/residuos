import { LocationObject } from 'expo-location';
import { ILocation } from 'vision-common';

export interface IDeviceLocalizacaoRepositorio {
  criarTabelaLocation: () => Promise<void>;

  inserirLocation: (location: ILocation) => Promise<number>;
  
  verificaPermissaoLocalizacao: () => Promise<boolean>;

  requisitaPermissaoLocalizacao: () => Promise<void>;

  pegarLocalizacaoAtual: () => Promise<LocationObject | null>;
}
