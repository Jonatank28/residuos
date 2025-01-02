import { ICliente } from './cliente';
import { IObra } from './obra';

export interface IFiltro {
  classificacao?: number;
  roterizacao?: number;
  cliente?: ICliente;
  obra?: IObra;
  rota?: number;
  dataColeta?: Date;
  xTemData?: boolean;
}
