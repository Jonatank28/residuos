import database from "../../../core/database";
import OrdemServicoRepositorio from '../../../core/data/repositories/ordemServicoRepositorio';
import DeviceOrdemServicoRepositorio from '../../../core/device/repositories/ordemServicoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../core/domain/repositories/device/ordemServicoRepositorio';
import { IOrdemServicoRepositorio } from '../../../core/domain/repositories/ordemServicoRepositorio';
import PegarRotasColetasAgendadasUseCase from '../../../core/domain/usecases/device/database/pegarRotasColetasAgendadasUseCase';
import PegarRotasUseCase from '../../../core/domain/usecases/pegarRotasUseCase';
import { getAxiosConnection, Presenter } from "vision-common";
import axiosClient from "../../../core/axios";

export default class FiltrarColetasPresenter extends Presenter {
  private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio;
  private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio;

  private readonly pegarRotasUseCase: PegarRotasUseCase;
  private readonly pegarRotasColetasAgendadasUseCase: PegarRotasColetasAgendadasUseCase;

  constructor(userID: number) {
    super(database);
    this.iOrdemServicoRepositorio = new OrdemServicoRepositorio(getAxiosConnection(axiosClient));
    this.iDeviceOrdemServicoRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);

    this.pegarRotasUseCase = new PegarRotasUseCase(this.iOrdemServicoRepositorio);
    this.pegarRotasColetasAgendadasUseCase = new PegarRotasColetasAgendadasUseCase(this.iDeviceOrdemServicoRepositorio);
  }

  pegarRotas = async (placa: string) => this.pegarRotasUseCase.execute(placa);

  pegarRotasDevice = async () => this.pegarRotasColetasAgendadasUseCase.execute();
}
