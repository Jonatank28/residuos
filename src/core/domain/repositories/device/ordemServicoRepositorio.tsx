import { ISQLRows } from 'vision-common';
import { IFiltro } from '../../entities/filtro';
import { IOrder } from '../../entities/order';
import { IRota } from '../../entities/rota';
import { PegarColetasAgendadasParams } from '../../usecases/device/database/pegarColetasAgendadasUseCase';
import { IVerificarDependenciaOSParams } from '../../usecases/device/database/verificarDependenciaOSUseCase';

export interface IDeviceOrdemServicoRepositorio {
  criarTabelaColetasEnviadas: () => Promise<void>;

  criarTabelaRotasColetasAgendadas: () => Promise<void>;

  criarTabelaNovasColetas: () => Promise<void>;

  criarTabelaColetasAgendadasPendente: () => Promise<void>;

  criarTabelaColetasAgendadas: () => Promise<void>;

  pegarColetasEnviadas: (search: string, filtros: IFiltro) => Promise<ISQLRows<IOrder>>;

  pegarNovasColetas: (search: string, filtros: IFiltro) => Promise<ISQLRows<IOrder>>;

  pegarColetaEnviada: (codigoVinculo: number | string) => Promise<IOrder>;

  pegarColetasEnviadas5Dias: () => Promise<ISQLRows<IOrder>>;

  pegarTotalLinhasColetasAgendadas: (params: PegarColetasAgendadasParams) => Promise<number>;

  pegarColetasAgendadas: (params: PegarColetasAgendadasParams) => Promise<ISQLRows<IOrder>>;

  verificarDependenciaOSAgendada: (params: IVerificarDependenciaOSParams) => Promise<number>;

  verificaExisteColetasPendentes: (placa: string) => Promise<number>;

  pegarColetasAgendadasPendente: (
    limit?: number,
    offset?: number,
    search?: string,
    filtros?: IFiltro,
  ) => Promise<ISQLRows<IOrder>>;

  pegarColetaAgendadaPendente: (codigoOS: number) => Promise<IOrder>;

  pegarColetaAgendada: (codigoOS: number) => Promise<IOrder>;

  deletarColetaAgendadaPendente: (codigoOS: number) => Promise<number>;

  inserirColetaEnviada: (coleta: IOrder, codigoVinculo: number | string) => Promise<number>;

  inserirColetaAgendadaPendente: (coleta: IOrder) => Promise<number>;

  inserirNovaColeta: (coleta: IOrder, codigoVinculo: number | string) => Promise<number>;

  pegarNovaColeta: (codigoVinculo: number | string) => Promise<IOrder>;

  pegarTodasColetasAgendadas: () => Promise<ISQLRows<IOrder>>;

  pegarRotasColetasAgendadas: () => Promise<ISQLRows<IRota>>;

  deletarColetaEnviada: (codigoVinculo: number | string) => Promise<number>;

  deletarColetaAgendada: (codigoOS: number) => Promise<number>;

  deletarNovaColeta: (codigoVinculo: number | string) => Promise<number>;

  inserirRotaColetaAgendada: (rota: IRota) => Promise<number>;

  deletarRotasColetasAgendadas: () => Promise<number>;

  deletarColetasAgendadasSincronizacao: () => Promise<void>;

  inserirColetasSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  pegarUltimoKmColetado: () => Promise<number>;
}
