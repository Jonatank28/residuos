import database from '../../../core/database';
import { getAxiosConnection, ILocalStorageConnection, IPaginationParams, Presenter } from 'vision-common';
import ResiduosRepositorio from '../../../core/data/repositories/residuosRepositorio';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import { IResiduosRepositorio } from '../../../core/domain/repositories/residuosRepositorio';
import PegarImobilizadosUseCase from '../../../core/domain/usecases/device/database/pegarImobilizadosUseCase';
import GetVeiculoUseCase from '../../../core/domain/usecases/device/getVeiculoUseCase';
import InserirEquipamentoUseCase, { IInserirEquipamentoParams } from '../../../core/domain/usecases/inserirEquipamentoUseCase';
import PegarEquipamentosUseCase, {
  IPegarEquipamentosUseCaseParams,
} from '../../../core/domain/usecases/pegarEquipamentosUseCase';
import SubstituirEquipamentoUseCase, {
  ISubstituirEquipamentoParams,
} from '../../../core/domain/usecases/substituirEquipamentoUseCase';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../../core/axios';
import PegarImobilizadosContratosUseCase from '../../../core/domain/usecases/device/database/pegarImobilizadosContratosUseCase';
import { IEquipamento } from '../../../core/domain/entities/equipamento';
import { IResiduo } from '../../../core/domain/entities/residuo';
import PegarTodosImobilizadosDeviceUseCase, { IPegarTodosImobilizadosUseCaseParametros } from '../../../core/domain/usecases/device/database/pegarTodosImobilizadosUseCase';
import PegarTodosImobilizadosUseCase from '../../../core/domain/usecases/pegarTodosImobilizadosUseCase';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';
import VincularImobilizadoNoResiduoUseCase from '../../../core/domain/usecases/device/database/vincularImobilizadoNoResiduoUseCase';
export default class ListaEquipamentosPresenter extends Presenter {
  private readonly iResiduosRepositorio: IResiduosRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iResiduosDeviceRepositorio: IDeviceResiduoRepositorio;

  private readonly pegarEquipamentosUseCase: PegarEquipamentosUseCase;
  private readonly pegarImobilizadosUseCase: PegarImobilizadosUseCase;
  private readonly pegarTodosImobilizadosUseCase: PegarTodosImobilizadosUseCase;
  private readonly vincularImobilizadoNoResiduoUseCase: VincularImobilizadoNoResiduoUseCase;
  private readonly pegarTodosImobilizadosDeviceUseCase: PegarTodosImobilizadosDeviceUseCase;
  private readonly getVeiculoUseCase: GetVeiculoUseCase;
  private readonly inserirEquipamentoUseCase: InserirEquipamentoUseCase;
  private readonly substituirEquipamentoUseCase: SubstituirEquipamentoUseCase;
  private readonly pegarImobilizadosContratosUseCase: PegarImobilizadosContratosUseCase;

  constructor(userID: number) {
    super(database);
    this.iResiduosRepositorio = new ResiduosRepositorio(getAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iResiduosDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);

    this.pegarEquipamentosUseCase = new PegarEquipamentosUseCase(this.iResiduosRepositorio);
    this.pegarImobilizadosUseCase = new PegarImobilizadosUseCase(this.iResiduosDeviceRepositorio);
    this.pegarTodosImobilizadosUseCase = new PegarTodosImobilizadosUseCase(this.iResiduosRepositorio);
    this.vincularImobilizadoNoResiduoUseCase = new VincularImobilizadoNoResiduoUseCase(this.iResiduosDeviceRepositorio);
    this.pegarTodosImobilizadosDeviceUseCase = new PegarTodosImobilizadosDeviceUseCase(this.iResiduosDeviceRepositorio)
    this.getVeiculoUseCase = new GetVeiculoUseCase(this.iLocalStorageConnection);
    this.inserirEquipamentoUseCase = new InserirEquipamentoUseCase(this.iResiduosRepositorio);
    this.substituirEquipamentoUseCase = new SubstituirEquipamentoUseCase(this.iResiduosRepositorio);
    this.pegarImobilizadosContratosUseCase = new PegarImobilizadosContratosUseCase(this.iResiduosDeviceRepositorio);
  }
  pegarEquipamentos = async (pagination: IPaginationParams, contratoID?: number, equipamentos?: IEquipamento[]) => {
    let codigosEquipamentosJaAdicionados: number[] = [];

    if (equipamentos) {
      equipamentos.forEach(equipamento => {
        if (equipamento.codigoContainer) {
          codigosEquipamentosJaAdicionados.push(equipamento.codigoContainer);
        }
      });
    }

    return this.pegarEquipamentosUseCase.execute({
      contratoID,
      pagination,
      codigosEquipamentosJaAdicionados: codigosEquipamentosJaAdicionados || [],
    });
  };

  pegarEquipamentosDevice = async (
    paginacao: IPaginationParams,
    equipamentosAdicionados: IEquipamento[],
    xSomenteEquipamentosLiberados: boolean,
  ) => this.pegarImobilizadosUseCase.execute({ paginacao, equipamentosAdicionados, xSomenteEquipamentosLiberados });

  pegarEquipamentosContratosDevice = async (
    contratoID: number,
    pagination: IPaginationParams,
    equipamentosAdicionados: IEquipamento[],
    residuosAdicionados: IResiduo[],
    xSomenteEquipamentosLiberados: boolean,
    somenteEquipamentosGenericos: boolean,
  ) =>
    this.pegarImobilizadosContratosUseCase.execute({
      contratoID,
      equipamentosAdicionados,
      residuosAdicionados,
      pagination,
      xSomenteEquipamentosLiberados,
      somenteEquipamentosGenericos,
    });

  pegarTodosImobilizados = async (params: IPegarTodosImobilizadosUseCaseParametros) => {
    
    return this.pegarTodosImobilizadosUseCase.execute(params)};
  
  pegarTodosImobilizadosDevice = async (params: IPegarTodosImobilizadosUseCaseParametros) => this.pegarTodosImobilizadosDeviceUseCase.execute(params)

  vincularImobilizadoNoResiduo = async (parametros: { codigoVinculo: string | number, imobilizado: IImobilizado }) => this.vincularImobilizadoNoResiduoUseCase.execute(parametros)

  pegarVeiculo = async () => this.getVeiculoUseCase.execute();

  adicionarEquipamento = async (params: IInserirEquipamentoParams) => this.inserirEquipamentoUseCase.execute(params);

  substituirEquipamento = async (params: ISubstituirEquipamentoParams) => this.substituirEquipamentoUseCase.execute(params);
}
