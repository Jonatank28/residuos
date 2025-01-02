import { IContainer } from './container';
import { IEndereco } from './endereco';

export interface ICliente {
  codigo?: number;
  nomeFantasia?: string;
  razaoSocial?: string;
  cpfcnpj?: string;
  endereco?: IEndereco;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  celular?: string;
  containers?: IContainer[];
}

export const setCliente = (value: any): ICliente => {
  const cliente: ICliente = {
    codigo: value?.codigo,
    nomeFantasia: value?.nomeFantasia,
    razaoSocial: value?.razaoSocial,
    inscricaoEstadual: value?.inscricaoEstadual,
    cpfcnpj: value?.cpfcnpj,
    inscricaoMunicipal: value?.inscricaoMunicipal,
    telefone: value?.telefone,
    celular: value?.celular,
    containers: value?.containers,
    endereco: {
      bairro: value?.bairro ?? '',
      cidade: value?.cidade ?? '',
      rua: value?.rua ?? '',
      numero: value?.numero ?? '',
      uf: value?.uf ?? '',
      complemento: value?.complemento ?? '',
    },
  };

  return cliente;
};
