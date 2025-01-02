import { ISQLRows } from 'vision-common';
import { IEstado } from '../../entities/estado';
import { IMtr } from '../../entities/mtr';

export interface IDeviceMtrRepositorio {
  criarTabelaMtrs: () => Promise<void>;

  criarTabelaEstadosMtrs: () => Promise<void>;

  inserirEstadoMtr: (estado: IEstado, codigoVinculo: string | number) => Promise<number>;

  inserirMtr: (mtr: IMtr, codigoVinculo: string | number) => Promise<number>;

  pegarMtrs: (codigoVinculo: string | number) => Promise<ISQLRows<IMtr>>;
  
  pegarEstadoMtr: (codigoEstado: number, vinculo: string | number) => Promise<IEstado>;
  
  pegarEstadosMtr: () => Promise<ISQLRows<IEstado>>;
  
  deletarMtr: (codigoVinculo: string | number) => Promise<number>;
  
  deletarEstadosMtr: (codigoVinculo: string | number) => Promise<number>;
  
  deletarEstadosMtrSincronizacao: () => Promise<number>;

  atualizarEstadoMtr: (estado: IEstado, codigoVinculo: string | number) => Promise<number>;

  atualizarMtr: (mtr: IMtr, codigoVinculo: string | number) => Promise<number>;

  inserirMtrSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirEstadoMtrSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;
}
