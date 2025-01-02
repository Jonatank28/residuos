import { IOrder } from '../../entities/order';
import { IPaginationParams, ISQLRows } from 'vision-common';

export interface IDeviceRascunhoRepositorio {
  criarTabelaRascunhos: () => Promise<void>;
  
  pegarRascunhoColeta: (codigoVinculo: number | string) => Promise<IOrder>;

  pegarRascunhos: (params: IPaginationParams) => Promise<ISQLRows<IOrder>>;

  pegarTodosRascunhos: () => Promise<ISQLRows<IOrder>>;

  pegarTotalLinhas: () => Promise<number>;

  inserirRascunho: (rascunho: IOrder, codigoVinculo: number | string) => Promise<number>;

  atualizarRascunho: (rascunho: IOrder, codigoVinculo: number | string) => Promise<number>;

  verificaRascunhoExiste: (codigoVinculo: number | string) => Promise<number>;

  deletarRascunhoColeta: (codigoVinculo: number | string) => Promise<number>;

  deletarTodosRascunhosVazios:() => Promise<void>;
}
