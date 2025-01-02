import database from "../../../core/database";
import { getAxiosConnection, ILocalStorageConnection, Presenter } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../../core/axios';
import AutenticacaoRepositorio from '../../../core/data/repositories/autenticacaoRepositorio';
import DeviceOrdemServicoRepositorio from '../../../core/device/repositories/ordemServicoRepositorio';
import { IServidor } from '../../../core/domain/entities/servidor';
import { IAutenticacaoRepositorio } from '../../../core/domain/repositories/autenticacaoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../core/domain/repositories/device/ordemServicoRepositorio';
import DeslogarUseCase from '../../../core/domain/usecases/deslogarUseCase';
import VerificaExisteColetasPendentesUseCase from '../../../core/domain/usecases/device/database/coletaPendente/verificaExisteColetasPendentesUseCase';
import GetServidorUseCase from '../../../core/domain/usecases/device/getServidorUseCase';
import SetServidorUseCase from '../../../core/domain/usecases/device/setServidorUseCase';

export default class ConfiguracaoInicialPresenter extends Presenter {
  private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iDeviceOrdemSerivoRepositorio: IDeviceOrdemServicoRepositorio;

  private readonly setServidorUseCase: SetServidorUseCase;
  private readonly deslogarUseCase: DeslogarUseCase;
  private readonly getServidorUseCase: GetServidorUseCase;
  private readonly verificaExisteColetasPendentesUseCase: VerificaExisteColetasPendentesUseCase;

  constructor(userID: number) {
    super(database);
    this.iAutenticacaoRepositorio = new AutenticacaoRepositorio(getAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iDeviceOrdemSerivoRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);

    this.setServidorUseCase = new SetServidorUseCase(this.iLocalStorageConnection);
    this.deslogarUseCase = new DeslogarUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
    this.getServidorUseCase = new GetServidorUseCase(this.iLocalStorageConnection);
    this.verificaExisteColetasPendentesUseCase = new VerificaExisteColetasPendentesUseCase(this.iDeviceOrdemSerivoRepositorio);
  }

  gravarServidor = async (servidor: IServidor) => this.setServidorUseCase.execute(servidor);

  deslogar = async () => this.deslogarUseCase.execute();

  pegarServidor = async () => this.getServidorUseCase.execute();

  verificaColetasPendentesDevice = async (placa: string) => this.verificaExisteColetasPendentesUseCase.execute(placa);
}
