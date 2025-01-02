import database from "../../../core/database";
import PegarColetasEnviadasUseCase from '../../../core/domain/usecases/device/database/coletaEnviada/pegarColetasEnviadasUseCase';
import DeviceOrdemServicoRepositorio from '../../../core/device/repositories/ordemServicoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../core/domain/repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../core/domain/repositories/device/imagemRepositorio';
import DeviceImagemRepositorio from '../../../core/device/repositories/imagemRepositorio';
import DeviceEnderecoRepositorio from '../../../core/device/repositories/enderecoRepositorio';
import { IDeviceMtrRepositorio } from '../../../core/domain/repositories/device/mtrRepositorio';
import DeviceMtrRepositorio from '../../../core/device/repositories/mtrRepositorio';
import PegarColetasAgendadasOfflineUseCase from '../../../core/domain/usecases/device/database/coletaPendente/pegarColetasAgendadasOfflineUseCase';
import { IFiltro } from '../../../core/domain/entities/filtro';
import { IDeviceMotivoRepositorio } from '../../../core/domain/repositories/device/deviceMotivoRepositorio';
import DeviceMotivoRepositorio from '../../../core/device/repositories/deviceMotivoRepositorio';
import { Presenter } from "vision-common";
import PegarNovasColetasUseCase from "../../../core/domain/usecases/device/database/novaColeta/pegarNovasColetasUseCase";

export default class HistoricoColetasPresenter extends Presenter {
  private readonly iDeviceOrdemServicoDeviceRepositroio: IDeviceOrdemServicoRepositorio;
  private readonly iDeviceResiduoDeviceRepositorio: IDeviceResiduoRepositorio;
  private readonly iDeviceEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceImagemDeviceRepositoio: IDeviceImagemRepositorio;
  private readonly iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;

  private readonly PegarColetasEnviadasUseCase: PegarColetasEnviadasUseCase;
  private readonly PegarColetasAgendadasOfflineUseCase: PegarColetasAgendadasOfflineUseCase;
  private readonly PegarNovasColetasUseCase: PegarNovasColetasUseCase;

  constructor(userID: number) {
    super(database);
    this.iDeviceOrdemServicoDeviceRepositroio = new DeviceOrdemServicoRepositorio(userID, this._connection);
    this.iDeviceResiduoDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iDeviceEnderecoDeviceRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceImagemDeviceRepositoio = new DeviceImagemRepositorio(userID, this._connection);
    this.iDeviceMtrDeviceRepositorio = new DeviceMtrRepositorio(userID, this._connection);
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);

    this.PegarColetasEnviadasUseCase = new PegarColetasEnviadasUseCase(this.iDeviceOrdemServicoDeviceRepositroio, this.iDeviceEnderecoDeviceRepositorio);
    this.PegarColetasAgendadasOfflineUseCase = new PegarColetasAgendadasOfflineUseCase(
      this.iDeviceOrdemServicoDeviceRepositroio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositoio,
      this.iDeviceResiduoDeviceRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceMotivoRepositorio
    );
    this.PegarNovasColetasUseCase = new PegarNovasColetasUseCase(
      this.iDeviceOrdemServicoDeviceRepositroio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositoio,
      this.iDeviceResiduoDeviceRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceMotivoRepositorio
    );
  }

  pegarColetas = async (pesquisa?: string, filtros?: IFiltro) => this.PegarColetasEnviadasUseCase.execute({ pesquisa, filtros });

  pegarColetasAgendadasOffline = async (search: string, filtros: IFiltro) => this.PegarColetasAgendadasOfflineUseCase.execute({ search, filtros });

  pegarNovasColetas = async (filtros: IFiltro, search: string) => this.PegarNovasColetasUseCase.execute({ filtros, search });
}
