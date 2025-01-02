import { IEndereco } from './endereco';

export interface IColeta {
  id?: number;
  os?: number;
  razaoSocial?: string;
  obra?: string;
  data?: string;
  status?: number;
  endereco?: IEndereco;
}
