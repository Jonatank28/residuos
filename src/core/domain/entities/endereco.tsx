import { ILocation } from 'vision-common';

export interface IEndereco {
  rua?: string;
  bairro?: string;
  numero?: number;
  letra?: string;
  complemento?: string;
  cidade?: string;
  uf?: string;
  latLng?: ILocation;
}

export const setEndereco = (value: any): IEndereco => {
  const endereco: IEndereco = {
    bairro: value?.bairro,
    cidade: value?.cidade,
    complemento: value?.complemento,
    letra: value?.letra,
    numero: value?.numero,
    rua: value?.rua,
    uf: value?.uf,
    latLng: {
      latitude: value?.latitude,
      longitude: value?.longitude,
    },
  };

  return endereco;
};
