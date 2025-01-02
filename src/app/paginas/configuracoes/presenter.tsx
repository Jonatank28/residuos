import database from "../../../core/database";
import AutenticacaoRepositorio from '../../../core/data/repositories/autenticacaoRepositorio';
import DeviceOrdemServicoRepositorio from '../../../core/device/repositories/ordemServicoRepositorio';
import { IAutenticacaoRepositorio } from '../../../core/domain/repositories/autenticacaoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../core/domain/repositories/device/ordemServicoRepositorio';
import DeslogarUseCase from '../../../core/domain/usecases/deslogarUseCase';
import VerificaExisteColetasPendentesUseCase from '../../../core/domain/usecases/device/database/coletaPendente/verificaExisteColetasPendentesUseCase';
import GetVersaoRestUseCase from '../../../core/domain/usecases/device/getVersaoRestUseCase';
import PegarVersaoRestUseCase from '../../../core/domain/usecases/pegarVersaoRestUseCase';
import { getAxiosConnection, ILocalStorageConnection, Presenter } from "vision-common";
import axiosClient from "../../../core/axios";
import LocalStorageConnection from "vision-common/src/app/hooks/asyncStorageConnection";

export default class ConfiguracoesPresenter extends Presenter {
  private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iDeviceOrdemSerivoRepositorio: IDeviceOrdemServicoRepositorio;

  private readonly deslogarUseCase: DeslogarUseCase;
  private readonly verificaExisteColetasPendentesUseCase: VerificaExisteColetasPendentesUseCase;
  private readonly pegarVersaoRestUseCase: PegarVersaoRestUseCase;
  private readonly getVersaoRestUseCase: GetVersaoRestUseCase;

  constructor(userID: number) {
    super(database);
    this.iAutenticacaoRepositorio = new AutenticacaoRepositorio(getAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iDeviceOrdemSerivoRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);

    this.deslogarUseCase = new DeslogarUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
    this.verificaExisteColetasPendentesUseCase = new VerificaExisteColetasPendentesUseCase(this.iDeviceOrdemSerivoRepositorio);
    this.pegarVersaoRestUseCase = new PegarVersaoRestUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
    this.getVersaoRestUseCase = new GetVersaoRestUseCase(this.iLocalStorageConnection);
  }

  deslogar = async () => this.deslogarUseCase.execute();

  verificaColetasPendentesDevice = async (placa: string) => this.verificaExisteColetasPendentesUseCase.execute(placa);

  pegarVersaoRest = async (bloqueiaVersao?: boolean) => this.pegarVersaoRestUseCase.execute(bloqueiaVersao);

  pegarVersaoRestDevice = async () => this.getVersaoRestUseCase.execute();

  executarSql = async (sql: string) => {
    try {
      return await this._connection.execute(sql);
    } catch (error) {
      console.log(error);
    }
  }
}
