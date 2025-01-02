import { IObra } from '../../entities/obra';
import { IPaginationParams, ISQLRows } from 'vision-common';
import { ICliente } from '../../entities/cliente';
import { IClienteCheckIn } from '../../entities/clienteCheckIn';
import { IPegarObrasClientesPaginadoDeviceParams } from '../../usecases/device/database/pegarObrasClientesPaginadoDeviceUseCase';
import { IVerificarObrasClienteDeviceUseCaseParams } from '../../usecases/device/database/verificarObrasClienteDeviceUseCase';
import { IGravarCheckInClienteParams } from '../../usecases/device/database/location/gravarCheckInClienteDeviceUseCase';

export interface IDeviceClienteRepositorio {
  criarTabelaClientes: () => Promise<void>;

  criarTabelaObras: () => Promise<void>;

  inserirObraCliente: (obra: IObra) => Promise<number>;

  inserirCliente: (cliente: ICliente) => Promise<number>;

  deletarCliente: (codigoCliente: number) => Promise<number>;

  deletarObrasClientes: () => Promise<void>;

  deletarClientes: () => Promise<number>;

  pegarTotalLinhasClientes: () => Promise<number>;

  pegarTotalLinhasObras: () => Promise<number>;

  pegarCliente: (codigoCliente: number) => Promise<ICliente>

  pegarObrasClientePaginado: (params: IVerificarObrasClienteDeviceUseCaseParams) => Promise<ISQLRows<IObra>>;

  pegarObrasCliente: (codigoCliente: number) => Promise<ISQLRows<IObra>>;

  pegarClientes: (params: IPaginationParams) => Promise<ISQLRows<ICliente>>;

  pegarObrasColetasAgendadasPaginado: (params: IPegarObrasClientesPaginadoDeviceParams) => Promise<ISQLRows<ICliente>>;

  pegarObrasHistoricoColetasPaginado: (params: IPegarObrasClientesPaginadoDeviceParams) => Promise<ISQLRows<ICliente>>;

  criarTabelaCheckInCheckOut: () => Promise<void>;

  inserirCheckIn: (params: IGravarCheckInClienteParams, localtionID: number) => Promise<number>;

  fazerCheckOut: (clienteID: number, locationID: number) => Promise<number>;

  verificaCheckInAtivo: () => Promise<number>;

  deletarCheckInClientes: () => Promise<number>;

  deletarAtualizarCheckInsOrdemServico: (codigoOS: number) => Promise<number>;

  pegarCheckInClientesDevice: () => Promise<ISQLRows<IClienteCheckIn>>;

  pegarCheckinPorCodigoOSDevice: (codigoOS: number) => Promise<IClienteCheckIn>;

  pegarCheckinsOrdemServicoDevice: (codigoOS: number) => Promise<ISQLRows<IClienteCheckIn>>;

  atualizarCheckoutClientePorCodigoOSDevice: (codigoOS: number, dataCheckout: Date, localizacaoID: number) => Promise<number>;

  inserirObrasClientesSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirClientesSincronizacao: (sql: string) => Promise<ISQLRows<void>>;
}
