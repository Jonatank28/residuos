import { getAxiosConnection, ILocalStorageConnection, IVeiculo } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../../core/axios';
import AutenticacaoRepositorio from '../../../core/data/repositories/autenticacaoRepositorio';
import { IRegiao } from '../../../core/domain/entities/regiao';
import { IAutenticacaoRepositorio } from '../../../core/domain/repositories/autenticacaoRepositorio';
import DeslogarUseCase from '../../../core/domain/usecases/deslogarUseCase';
import GetRegioesUseCase from '../../../core/domain/usecases/device/getRegioesUseCase';
import SetRegioesUseCase from '../../../core/domain/usecases/device/setRegioesUseCase';
import SetVeiculoUseCase from '../../../core/domain/usecases/device/setVeiculoUseCase';

export default class AdicionarRegioesPresenter {
  private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly setVeiculoUseCase: SetVeiculoUseCase;
  private readonly setRegioesUseCase: SetRegioesUseCase;
  private readonly getRegioesUseCase: GetRegioesUseCase;
  private readonly deslogarUseCase: DeslogarUseCase;

  constructor() {
    this.iAutenticacaoRepositorio = new AutenticacaoRepositorio(getAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.setVeiculoUseCase = new SetVeiculoUseCase(this.iLocalStorageConnection);
    this.setRegioesUseCase = new SetRegioesUseCase(this.iLocalStorageConnection);
    this.getRegioesUseCase = new GetRegioesUseCase(this.iLocalStorageConnection);
    this.deslogarUseCase = new DeslogarUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
  }

  setVeiculo = async (veiculo: IVeiculo) => this.setVeiculoUseCase.execute(veiculo);

  setRegioes = async (regioes: IRegiao[]) => this.setRegioesUseCase.execute(regioes);

  getRegioes = async () => this.getRegioesUseCase.execute();

  deslogar = async () => this.deslogarUseCase.execute();
}
