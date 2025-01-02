import { IPaginationParams, ISQLRows } from 'vision-common';
import { IContainer } from '../../entities/container';
import { IEquipamento } from '../../entities/equipamento';
import { IImobilizado } from '../../entities/imobilizado';
import { IResiduo } from '../../entities/residuo';
import { IPegarEquipamentosClienteDeviceUseCaseParams } from '../../usecases/device/database/pegarEquipamentosClienteUseCase';
import { IPegarImobilizadosUseCaseParams } from '../../usecases/device/database/pegarImobilizadosContratosUseCase';
import { IPegarImobilizadosUseCaseParametros } from '../../usecases/device/database/pegarImobilizadosUseCase';
import { IPegarTodosImobilizadosUseCaseParametros } from '../../usecases/device/database/pegarTodosImobilizadosUseCase';

export interface IDeviceResiduoRepositorio {
  criarTabelaResiduos: () => Promise<void>;

  criarTabelaResiduosContrato: () => Promise<void>;

  criarTabelaResiduosPesagem: () => Promise<void>;

  criarTabelaResiduosBase: () => Promise<void>;

  criarTabelaEquipamentos: () => Promise<void>;

  criarTabelaEquipamentosPendentesLiberacao: () => Promise<void>;

  criarTabelaImobilizadosContratos: () => Promise<void>;

  criarTabelaImobilizadoGenericoContratos: () => Promise<void>;

  criarTabelaEquipamentosClientes: () => Promise<void>;

  criarTabelaImobilizados: () => Promise<void>;
  criarTabelaTodosImobilizados: () => Promise<void>;

  criarTabelaContainers: () => Promise<void>;

  inserirContainer: (container: IContainer) => Promise<number>;

  inserirResiduo: (residuo: IResiduo, codigoVinculo: string | number) => Promise<number>;

  verificarReisiduoGenerico: (codigoVinculo: string | number) => Promise<number>;

  inserirResiduoPesagem: (residuo: IResiduo, codigoVinculo: string) => Promise<number>;

  inserirResiduoContrato: (residuo: IResiduo) => Promise<number>;

  inserirImobilizado: (imobilizados: IImobilizado) => Promise<number>;

  deletarResiduo: (condigoVinculo: string | number) => Promise<number>;

  deletarResiduoSecundarioPesagem: (codigoVinculo: string) => Promise<number>;

  deletarRascunhoResiduoSecundarioPesagem: (codigoVinculo: string) => Promise<number>;

  deletarResiduosContrato: () => Promise<number>;

  deletarResiduosBase: () => Promise<number>;

  deletarResiduos: () => Promise<number>;

  deletarTodosImobilizados: () => Promise<number>;

  inserirEquipamento: (equipamentos: IEquipamento, codigoVinculo: number | string) => Promise<number>;

  inserirEquipamentoCliente: (equipamento: IEquipamento) => Promise<number>;

  deletarEquipamento: (condigoVinculo: string | number) => Promise<number>;

  deletarEquipamentosClientes: () => Promise<number>;

  deletarEquipamentosPendentesLiberacao: () => Promise<number>;

  deletarImobilizados: () => Promise<number>;

  deletarImobilizadosContratos: () => Promise<number>;
  deletarImobilizadosGenericosContratos: () => Promise<number>;

  pegarContainers: (codigoCliente: number) => Promise<ISQLRows<IContainer>>;

  pegarResiduosVinculo: (codigoVinculo: string | number) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosSemVinculo: (params: IPaginationParams) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosBase: () => Promise<ISQLRows<IResiduo>>;

  pegarResiduosGenericosPesagem: (codigoVinculo: number | string) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosSecundariosPesagem: (codigoVinculo: number | string) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosContratoServico: (clienteID: number) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosPeloContratoOrSemContrato: (clienteID: number, contratoID: number) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosSemContratoPorClienteServico: (clienteID: number) => Promise<ISQLRows<IResiduo>>;

  pegarResiduosComContratoServico: (clienteID: number, contratoID: number) => Promise<ISQLRows<IResiduo>>;

  pegarImobilizadoGenericoPorCodigo: (residuoID: number, nomeTabela: string) => Promise<IResiduo>;

  pegarTotalLinhasResiduos: () => Promise<number>;

  pegarTotalLinhasImobilizados: (codigosEquipamentosJaAdicionados?: number[]) => Promise<number>;

  pegarTotalLinhasImobilizadosContratos: (
    params: IPegarImobilizadosUseCaseParams,
    codigosEquipamentosJaAdicionados?: number[],
  ) => Promise<number>;

  pegarEquipamentos: (codigoVinculo: string | number) => Promise<ISQLRows<IEquipamento>>;

  pegarEquipamentosCliente: (params: IPegarEquipamentosClienteDeviceUseCaseParams) => Promise<ISQLRows<IEquipamento>>;

  pegarImobilizados: (parametros: IPegarImobilizadosUseCaseParametros, codigosEquipamentosJaAdicionados?: number[]) => Promise<ISQLRows<IImobilizado>>;

  pegarTodosImobilizados: (parametros: IPegarTodosImobilizadosUseCaseParametros) => Promise<ISQLRows<IImobilizado>>;

  vincularImobilizadoNoResiduo: (parametros: {
    codigoVinculo: string | number;
    imobilizado: IImobilizado;
  }) => Promise<void | Error>;

  pegarImobilizadoDoResiduoVinculo: (codigoVinculo: string | number) => Promise<ISQLRows<IImobilizado>>;

  pegarImobilizadosContratos: (
    params: IPegarImobilizadosUseCaseParams,
    codigosEquipamentosJaAdicionados: number[],
  ) => Promise<ISQLRows<IImobilizado>>;

  inserirResiduosContratoSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirResiduosBaseSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirResiduoSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirEquipamentoSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirImobilizadosSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;
  inserirTodosImobilizadosSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirEquipamentosPendentesLiberacaoSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;
  inserirImobilizadosGenericosContratosSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirImobilizadosContratosSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirContainersSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;
}
