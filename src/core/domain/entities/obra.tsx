import { IEndereco } from './endereco';

export interface IObra {
  codigo?: number;
  codigoCliente?: number;
  codigoDestinador?: number;
  descricao?: string;
  codigoContrato?: number;
  codigoEmpresa?: number;
  endereco?: IEndereco;
}

export const setObra = (value: any): IObra => {
  const obra: IObra = {
    codigo: value.codigo,
    codigoCliente: value.codigoCliente,
    descricao: value.descricao,
    codigoContrato: value.codigoContrato,
    codigoDestinador: value?.codigoDestinador,
    codigoEmpresa: value?.codigoEmpresa,
    endereco: {
      bairro: value.bairro,
      rua: value.rua,
      numero: value.numero,
      letra: value.letra,
      complemento: value.complemento,
      cidade: value.cidade,
      uf: value.uf,
    },
  };

  return obra;
};
