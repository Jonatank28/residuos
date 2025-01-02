import database from "../../../../core/database";
import { getAxiosConnection, ILocalStorageConnection, IPaginationParams, IRegiao, Presenter } from 'vision-common';
import ClienteRepositorio from "../../../../core/data/repositories/clienteRepositorio";
import DeviceClienteRepositorio from "../../../../core/device/repositories/clienteRepositorio";
import DeviceEnderecoRepositorio from "../../../../core/device/repositories/enderecoRepositorio";
import DeviceResiduoRepositorio from "../../../../core/device/repositories/residuoRepositorio";
import { IClienteRepositorio } from "../../../../core/domain/repositories/clienteRepositorio";
import { IDeviceClienteRepositorio } from "../../../../core/domain/repositories/device/clienteRepositorio";
import { IDeviceEnderecoRepositorio } from "../../../../core/domain/repositories/device/enderecoRepositorio";
import { IDeviceResiduoRepositorio } from "../../../../core/domain/repositories/device/residuoRepositorio";
import PegarClientesDeviceUseCase from "../../../../core/domain/usecases/device/database/pegarClientesUseCase";
import GetRegioesUseCase from "../../../../core/domain/usecases/device/getRegioesUseCase";
import PegarClientesUseCase from "../../../../core/domain/usecases/pegarClientesUseCase";
import LocalStorageConnection from "vision-common/src/app/hooks/asyncStorageConnection";
import axiosClient from "../../../../core/axios";

export default class ClientesPresenter extends Presenter {
  private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio;
  private readonly iClienteRepositorio: IClienteRepositorio;
  private readonly iResiduoRepositorio: IDeviceResiduoRepositorio;
  private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly pegarClientesUseCase: PegarClientesUseCase;
  private readonly pegarClientesDeviceUseCase: PegarClientesDeviceUseCase;
  private readonly getRegioesUseCase: GetRegioesUseCase;

  constructor(userID: number) {
    super(database);
    this.iClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);
    this.iClienteRepositorio = new ClienteRepositorio(getAxiosConnection(axiosClient));
    this.iResiduoRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iEnderecoRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.pegarClientesUseCase = new PegarClientesUseCase(this.iClienteRepositorio);
    this.pegarClientesDeviceUseCase = new PegarClientesDeviceUseCase(
      this.iClienteDeviceRepositorio,
      this.iEnderecoRepositorio,
      this.iResiduoRepositorio
    );
    this.getRegioesUseCase = new GetRegioesUseCase(this.iLocalStorageConnection);
  }

  pegarClientes = async (pagination: IPaginationParams, regioes?: IRegiao[]) => this.pegarClientesUseCase.execute({
    pagination,
    regioes: regioes ?? []
  });

  pegarClientesDevice = async (params: IPaginationParams) => this.pegarClientesDeviceUseCase.execute(params);

  pegarCodigosRegioes = async () => this.getRegioesUseCase.execute();
}
