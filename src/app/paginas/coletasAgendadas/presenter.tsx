import database from "../../../core/database";
import OrdemServicoRepositorio from '../../../core/data/repositories/ordemServicoRepositorio';
import { IOrdemServicoRepositorio } from '../../../core/domain/repositories/ordemServicoRepositorio';
import PegarColetasAgendadasUseCase, { IPegarColetasAgendadasParams } from '../../../core/domain/usecases/pegarColetasAgendadasUseCase';
import PegarColetasAgendadasDeviceUseCase, { PegarColetasAgendadasParams } from '../../../core/domain/usecases/device/database/pegarColetasAgendadasUseCase';
import { IOrder } from '../../../core/domain/entities/order';
import { IDeviceOrdemServicoRepositorio } from '../../../core/domain/repositories/device/ordemServicoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import DeviceImagemRepositorio from '../../../core/device/repositories/imagemRepositorio';
import DeviceOrdemServicoRepositorio from '../../../core/device/repositories/ordemServicoRepositorio';
import DeviceEnderecoRepositorio from '../../../core/device/repositories/enderecoRepositorio';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';
import { IDeviceMtrRepositorio } from '../../../core/domain/repositories/device/mtrRepositorio';
import DeviceMtrRepositorio from '../../../core/device/repositories/mtrRepositorio';
import { IDeviceChecklistRepositorio } from '../../../core/domain/repositories/device/checklistRepositorio';
import DeviceChecklistRepositorio from '../../../core/device/repositories/checklistRepositorio';
import DeletarColetasAgendadasUseCase from '../../../core/domain/usecases/device/database/deletarColetasAgendadasUseCase';
import PegarCidadesColetasAgendadasUseCase from '../../../core/domain/usecases/device/database/pegarCidadesColetasAgendadasUseCase';
import PegarTodasColetasAgendadasUseCase from '../../../core/domain/usecases/pegarTodasColetasAgendadasUseCase';
import { IFiltro } from '../../../core/domain/entities/filtro';
import { IDeviceMotivoRepositorio } from '../../../core/domain/repositories/device/deviceMotivoRepositorio';
import DeviceMotivoRepositorio from '../../../core/device/repositories/deviceMotivoRepositorio';
import { getAxiosConnection, Presenter } from "vision-common";
import axiosClient from "../../../core/axios";
import GravarColetasAgendadasDeviceUseCase from "../../../core/domain/usecases/sincronizacao/gravarColetasAgendadasDeviceUseCase";

export default class ColetasAgendadasPresenter extends Presenter {
  private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio;
  private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio;
  private readonly iDeviceEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceImagemDeviceRepositoio: IDeviceImagemRepositorio;
  private readonly iDeviceOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio;
  private readonly iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio;
  private readonly iDeviceCheckDevicelistRepositorio: IDeviceChecklistRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;

  private readonly gravarColetasAgendadasDeviceUseCase: GravarColetasAgendadasDeviceUseCase;
  private readonly pegarTodasColetasAgendadasUseCase: PegarTodasColetasAgendadasUseCase;
  private readonly deletarColetasAgendadasUseCase: DeletarColetasAgendadasUseCase;
  private readonly pegarCidadesColetasAgendadasUseCase: PegarCidadesColetasAgendadasUseCase;
  private readonly pegarColetasAgendadasUseCase: PegarColetasAgendadasUseCase;
  private readonly pegarColetasAgendadasDeviceUseCase: PegarColetasAgendadasDeviceUseCase;

  constructor(private readonly userID: number) {
    super(database);

    this.userID = userID;

    this.iOrdemServicoRepositorio = new OrdemServicoRepositorio(getAxiosConnection(axiosClient));
    this.iDeviceResiduoRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iDeviceEnderecoDeviceRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceImagemDeviceRepositoio = new DeviceImagemRepositorio(userID, this._connection);
    this.iDeviceOrdemServicoDeviceRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);
    this.iDeviceMtrDeviceRepositorio = new DeviceMtrRepositorio(userID, this._connection);
    this.iDeviceCheckDevicelistRepositorio = new DeviceChecklistRepositorio(userID, this._connection);
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);

    this.gravarColetasAgendadasDeviceUseCase = new GravarColetasAgendadasDeviceUseCase(
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceCheckDevicelistRepositorio
    );
    this.pegarTodasColetasAgendadasUseCase = new PegarTodasColetasAgendadasUseCase(
      this.iOrdemServicoRepositorio,
      this.iDeviceOrdemServicoDeviceRepositorio
    );
    this.deletarColetasAgendadasUseCase = new DeletarColetasAgendadasUseCase(
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositoio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceCheckDevicelistRepositorio,
      this.iDeviceMotivoRepositorio
    );
    this.pegarCidadesColetasAgendadasUseCase = new PegarCidadesColetasAgendadasUseCase(this.iDeviceEnderecoDeviceRepositorio);
    this.pegarColetasAgendadasUseCase = new PegarColetasAgendadasUseCase(
      this.iOrdemServicoRepositorio,
      this.iDeviceOrdemServicoDeviceRepositorio
    );
    this.pegarColetasAgendadasDeviceUseCase = new PegarColetasAgendadasDeviceUseCase(
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio
    );
  }

  gravarColetasAgendadas = async (coletas: IOrder[]) => this.gravarColetasAgendadasDeviceUseCase.execute({ coletas, userID: this.userID });

  pegarTodasColetas = async () => this.pegarTodasColetasAgendadasUseCase.execute();

  pegarColetas = async (params: IPegarColetasAgendadasParams) => this.pegarColetasAgendadasUseCase.execute(params);

  deletarColetasAgendadasDevice = async () => this.deletarColetasAgendadasUseCase.execute();

  pegarCidadesAgendadas = async (placa: string, filtros?: IFiltro) => this.pegarCidadesColetasAgendadasUseCase.execute({ placa, filtros });

  pegarColetasAgendadasStorage = async (params: PegarColetasAgendadasParams) => this.pegarColetasAgendadasDeviceUseCase.execute(params);
}
