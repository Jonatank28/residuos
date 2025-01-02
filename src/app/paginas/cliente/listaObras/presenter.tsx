import database from "../../../../core/database";
import ClienteRepositorio from '../../../../core/data/repositories/clienteRepositorio';
import { IClienteRepositorio } from '../../../../core/domain/repositories/clienteRepositorio';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import PegarObrasClientesPaginadoUseCase, { IPegarObrasClientesParams } from '../../../../core/domain/usecases/pegarObrasClientesPaginadoUseCase';
import PegarObrasClientesPaginadoDeviceUseCase, { IPegarObrasClientesPaginadoDeviceParams } from '../../../../core/domain/usecases/device/database/pegarObrasClientesPaginadoDeviceUseCase';
import { getAxiosConnection, Presenter } from "vision-common";
import axiosClient from "../../../../core/axios";

export default class ListaObrasPresenter extends Presenter {
  private readonly iClienteRepositorio: IClienteRepositorio;
  private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio;

  private readonly pegarObrasClientesPaginadoUseCase: PegarObrasClientesPaginadoUseCase;
  private readonly pegarObrasClientesPaginadoDeviceUseCase: PegarObrasClientesPaginadoDeviceUseCase;
  
  constructor(userID: number) {
    super(database);
    this.iClienteRepositorio = new ClienteRepositorio(getAxiosConnection(axiosClient));
    this.iClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);
    
    this.pegarObrasClientesPaginadoUseCase = new PegarObrasClientesPaginadoUseCase(this.iClienteRepositorio);
    this.pegarObrasClientesPaginadoDeviceUseCase = new PegarObrasClientesPaginadoDeviceUseCase(this.iClienteDeviceRepositorio);
  }

  pegarObrasPaginado = async (params: IPegarObrasClientesParams) => this.pegarObrasClientesPaginadoUseCase.execute(params);

  pegarObrasPaginadoDevice = async (params: IPegarObrasClientesPaginadoDeviceParams) => this.pegarObrasClientesPaginadoDeviceUseCase.execute(params);
}
