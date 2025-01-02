import { getAxiosConnection, IPaginationParams, Presenter } from "vision-common";
import axiosClient from "../../../../core/axios";
import ClienteRepositorio from "../../../../core/data/repositories/clienteRepositorio";
import database from "../../../../core/database";
import DeviceClienteRepositorio from "../../../../core/device/repositories/clienteRepositorio";
import DeviceEnderecoRepositorio from "../../../../core/device/repositories/enderecoRepositorio";
import { IObra } from "../../../../core/domain/entities/obra";
import { IClienteRepositorio } from "../../../../core/domain/repositories/clienteRepositorio";
import { IDeviceClienteRepositorio } from "../../../../core/domain/repositories/device/clienteRepositorio";
import { IDeviceEnderecoRepositorio } from "../../../../core/domain/repositories/device/enderecoRepositorio";
import PegarObrasClientePaginadoDeviceUseCase from "../../../../core/domain/usecases/device/database/pegarObrasClientePaginadoDeviceUseCase";
import PegarObrasClientePaginadoUseCase from "../../../../core/domain/usecases/pegarObrasClientePaginadoUseCase";

export default class ObrasPresenter extends Presenter {
  private readonly iClienteRepositorio: IClienteRepositorio;
  private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio;
  private readonly iEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio;

  private readonly pegarObrasClientePaginadoUseCase: PegarObrasClientePaginadoUseCase;
  private readonly pegarObrasClientePaginadoDeviceUseCase: PegarObrasClientePaginadoDeviceUseCase;

  constructor(userID: number) {
    super(database);
    this.iClienteRepositorio = new ClienteRepositorio(getAxiosConnection(axiosClient));
    this.iClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);
    this.iEnderecoDeviceRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    
    this.pegarObrasClientePaginadoUseCase = new PegarObrasClientePaginadoUseCase(this.iClienteRepositorio);
    this.pegarObrasClientePaginadoDeviceUseCase = new PegarObrasClientePaginadoDeviceUseCase(this.iClienteDeviceRepositorio, this.iEnderecoDeviceRepositorio)
  }

  paginarObrasClientePaginadoOnline = (clienteID: number, pagination: IPaginationParams) => this.pegarObrasClientePaginadoUseCase.execute({
    clienteID,
    pagination
  });

  paginarObrasClientePaginadoDevice = (clienteID: number, pagination: IPaginationParams) => this.pegarObrasClientePaginadoDeviceUseCase.execute({
    clienteID,
    pagination
  });
}
