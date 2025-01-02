import { ILocalStorageConnection, IPaginationParams, IVeiculo } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import VeiculoRepositorio from '../../../core/data/repositories/veiculoRepositorio';
import { IVeiculoRepositorio } from '../../../core/domain/repositories/veiculosRepositorio';
import GetVeiculoUseCase from '../../../core/domain/usecases/device/getVeiculoUseCase';
import SetVeiculoUseCase from '../../../core/domain/usecases/device/setVeiculoUseCase';
import PegarVeiculosUseCase from '../../../core/domain/usecases/pegarVeiculosUseCase';

export default class AlterarPlacaPresenter {
  private readonly iVeiculoRepositorio: IVeiculoRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly pegarVeiculosUseCase: PegarVeiculosUseCase;
  private readonly setVeiculoUseCase: SetVeiculoUseCase;
  private readonly getVeiculoUseCase: GetVeiculoUseCase;

  constructor() {
    this.iVeiculoRepositorio = new VeiculoRepositorio();
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.pegarVeiculosUseCase = new PegarVeiculosUseCase(this.iVeiculoRepositorio);
    this.setVeiculoUseCase = new SetVeiculoUseCase(this.iLocalStorageConnection);
    this.getVeiculoUseCase = new GetVeiculoUseCase(this.iLocalStorageConnection);
  }

  pegarVeiculos = async (pagination: IPaginationParams) => this.pegarVeiculosUseCase.execute(pagination);

  setVeiculo = async (veiculo: IVeiculo) => this.setVeiculoUseCase.execute(veiculo);

  getVeiculo = async () => this.getVeiculoUseCase.execute();
}
