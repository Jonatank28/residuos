import database from "../../../core/database";
import { IOrder } from '../../../core/domain/entities/order';
import DeviceChecklistRepositorio from '../../../core/device/repositories/checklistRepositorio';
import DeviceMotivoRepositorio from '../../../core/device/repositories/deviceMotivoRepositorio';
import DeviceEnderecoRepositorio from '../../../core/device/repositories/enderecoRepositorio';
import DeviceImagemRepositorio from '../../../core/device/repositories/imagemRepositorio';
import DeviceMtrRepositorio from '../../../core/device/repositories/mtrRepositorio';
import DeviceRascunhoRepositorio from '../../../core/device/repositories/rascunhoRepositorio';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';
import { IDeviceChecklistRepositorio } from '../../../core/domain/repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../../core/domain/repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../core/domain/repositories/device/mtrRepositorio';
import { IDeviceRascunhoRepositorio } from '../../../core/domain/repositories/device/rascunhoRepositoiro';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import DeletarRascunhoColetaUseCase from '../../../core/domain/usecases/device/database/rascunho/deletarRascunhoColetaUseCase';
import PegarRascunhoColetaUseCase from '../../../core/domain/usecases/device/database/rascunho/pegarRascunhoColetaUseCase';
import { Presenter } from "vision-common";

export default class RascunhoDetalhesPresenter extends Presenter {
  private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio;
  private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio;
  private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio;
  private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio;
  private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;

  private readonly pegarRascunhoColetaUseCase: PegarRascunhoColetaUseCase;
  private readonly deletarRascunhoColetaUseCase: DeletarRascunhoColetaUseCase;

  constructor(userID: number) {
    super(database);
    this.iDeviceRascunhoRepositorio = new DeviceRascunhoRepositorio(userID, this._connection);
    this.iDeviceEnderecoRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceResiduoRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iDeviceImagemRepositorio = new DeviceImagemRepositorio(userID, this._connection);
    this.iDeviceMtrRepositorio = new DeviceMtrRepositorio(userID, this._connection);
    this.iDeviceChecklistRepositorio = new DeviceChecklistRepositorio(userID, this._connection);
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);

    this.pegarRascunhoColetaUseCase = new PegarRascunhoColetaUseCase(
      this.iDeviceRascunhoRepositorio,
      this.iDeviceEnderecoRepositorio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceImagemRepositorio,
      this.iDeviceMtrRepositorio,
      this.iDeviceChecklistRepositorio,
      this.iDeviceMotivoRepositorio
    );
    this.deletarRascunhoColetaUseCase = new DeletarRascunhoColetaUseCase(
      this.iDeviceRascunhoRepositorio,
      this.iDeviceEnderecoRepositorio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceImagemRepositorio,
      this.iDeviceMtrRepositorio,
      this.iDeviceChecklistRepositorio,
      this.iDeviceMotivoRepositorio
    );
  }

  pegarRascunho = async (rascunho: IOrder) => this.pegarRascunhoColetaUseCase.execute(rascunho);

  deletarRascunhoColeta = async (rascunho: IOrder) => this.deletarRascunhoColetaUseCase.execute(rascunho);
}
