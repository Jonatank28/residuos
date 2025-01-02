import { IEstado } from './estado';

export interface IMtr {
  mtr?: string;
  mtrCodBarras?: string;
  hasSinir?: boolean;
  codigoEstado?: number;
  dataEmissao?: Date;
  estado?: IEstado;
  base64MtrOnline?: string;
}

export const setMtr = (value: any): IMtr => ({
  mtr: value?.mtr,
  hasSinir: value?.tipo === 2,
  dataEmissao: value?.dataEmissao,
  mtrCodBarras: value?.mtrCodBarras,
  base64MtrOnline: value?.arquivoBase64,
  estado: {
    codigo: value?.codigoEstado,
    descricao: value?.uf,
  },
});
