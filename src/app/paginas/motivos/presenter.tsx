import database from "../../../core/database";
import OrdemServicoRepositorio from '../../../core/data/repositories/ordemServicoRepositorio';
import { IOrdemServicoRepositorio } from '../../../core/domain/repositories/ordemServicoRepositorio';
import PegarMotivosUseCase from '../../../core/domain/usecases/pegarMotivosUseCase';
import PegarMotivosDeviceUseCase from '../../../core/domain/usecases/device/database/pegarMotivosUseCase';
import { IDeviceMotivoRepositorio } from '../../../core/domain/repositories/device/deviceMotivoRepositorio';
import DeviceMotivoRepositorio from '../../../core/device/repositories/deviceMotivoRepositorio';
import { getAxiosConnection, Presenter } from "vision-common";
import axiosClient from "../../../core/axios";

export default class MotivosPresenter extends Presenter {
  private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;

  private readonly pegarMotivosUseCase: PegarMotivosUseCase;
  private readonly pegarMotivosDeviceUseCase: PegarMotivosDeviceUseCase;

  constructor(userID: number) {
    super(database);
    this.iOrdemServicoRepositorio = new OrdemServicoRepositorio(getAxiosConnection(axiosClient));
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);

    this.pegarMotivosUseCase = new PegarMotivosUseCase(this.iOrdemServicoRepositorio);
    this.pegarMotivosDeviceUseCase = new PegarMotivosDeviceUseCase(this.iDeviceMotivoRepositorio);
  }

  pegarMotivos = async () => this.pegarMotivosUseCase.execute();

  pegarMotivosDevice = async () => this.pegarMotivosDeviceUseCase.execute();
}
