import { IRetornoBalanca } from '../../../core/domain/entities/balanca/balanca';

export const tratarWW3000iR = (data: string): IRetornoBalanca => {
  return {
    estabilidade: data.substring(0, 2).replace(/\s/g, ''),
    tipoPeso: data.substring(3, 5).replace(/\s/g, ''),
    prefix: data.substring(6, 7).replace(/\s/g, ''),
    valor: data.substring(7, 15).replace(/\s/g, ''),
    unidade: data.includes('Neh') ? '' : data.substring(17, 19).replace(/\s/g, ''),
    terminacao: data.substring(19, 25).replace(/\s/g, ''),
  };
};
