import VerificarRelacoesMtrUseCase from '../../../../core/domain/usecases/mtr/verificarRelacoesMtrUseCase';
import { IMtrRepositorio } from '../../../../core/domain/repositories/mtrRepositorio';
import MtrRepositorio from '../../../../core/data/repositories/mtrRepositorio';
import PegarMtrsUseCase from '../../../../core/domain/usecases/mtr/pegarMtrsUseCase';
import GetVeiculoUseCase from '../../../../core/domain/usecases/device/getVeiculoUseCase';
import { getAxiosConnection, ILocalStorageConnection } from 'vision-common';
import axiosClient from '../../../../core/axios';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';

export default class ColetaVerificarPresenter {
  private readonly iMtrRepositorio: IMtrRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly getVeiculoUseCase: GetVeiculoUseCase;
  private readonly verificarRelacoesMtrUseCase: VerificarRelacoesMtrUseCase;
  private readonly pegarMtrsUseCase: PegarMtrsUseCase;

  constructor() {
    this.iMtrRepositorio = new MtrRepositorio(getAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.getVeiculoUseCase = new GetVeiculoUseCase(this.iLocalStorageConnection);
    this.verificarRelacoesMtrUseCase = new VerificarRelacoesMtrUseCase(this.iMtrRepositorio);
    this.pegarMtrsUseCase = new PegarMtrsUseCase(this.iMtrRepositorio);
  }

  pegarVeiculo = async () => this.getVeiculoUseCase.execute();

  verificarRelacao = async (codigoOS: number) => this.verificarRelacoesMtrUseCase.execute(codigoOS);

  pegarMtrRelacao = async (codigoOS: number) => this.pegarMtrsUseCase.execute(codigoOS);
}
