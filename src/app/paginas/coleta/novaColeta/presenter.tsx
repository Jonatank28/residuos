import database from '../../../../core/database';
import axiosClient from '../../../../core/axios';
import ClienteRepositorio from '../../../../core/data/repositories/clienteRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import DeviceEnderecoRepositorio from '../../../../core/device/repositories/enderecoRepositorio';
import { IClienteRepositorio } from '../../../../core/domain/repositories/clienteRepositorio';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../core/domain/repositories/device/enderecoRepositorio';
import GetVeiculoUseCase from '../../../../core/domain/usecases/device/getVeiculoUseCase';
import { AsyncAxiosConnection, ILocalStorageConnection, IPaginationParams, Presenter } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import VerificarObrasContratoClienteOnlineUseCase from '../../../../core/domain/usecases/verificarObrasContratoClienteOnlineUseCase';
import VerificarObrasClienteDeviceUseCase from '../../../../core/domain/usecases/device/database/verificarObrasClienteDeviceUseCase';
import PegarUltimoKmColetadoUsecase from '../../../../core/domain/usecases/device/database/km/pegarUltimoKmColetadoUseCase';
import { IDeviceOrdemServicoRepositorio } from '../../../../core/domain/repositories/device/ordemServicoRepositorio';
import DeviceOrdemServicoRepositorio from '../../../../core/device/repositories/ordemServicoRepositorio';

export default class NovaColetaPresenter extends Presenter {
  private readonly iClienteRepositorio: IClienteRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio;
  private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio;

  private readonly verificarObrasContratoClienteOnlineUseCase: VerificarObrasContratoClienteOnlineUseCase;
  // private readonly pegarObrasClienteUseCase: PegarObrasClienteUseCase;
  private readonly verificarObrasClienteDeviceUseCase: VerificarObrasClienteDeviceUseCase;
  private readonly getVeiculoUseCase: GetVeiculoUseCase;
  private readonly pegarUltimoKmColetadoUsecase: PegarUltimoKmColetadoUsecase;

  constructor(userID: number) {
    super(database);

    this.iClienteRepositorio = new ClienteRepositorio(new AsyncAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);
    this.iEnderecoRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceOrdemServicoDeviceRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);

    this.verificarObrasContratoClienteOnlineUseCase = new VerificarObrasContratoClienteOnlineUseCase(this.iClienteRepositorio);
    this.verificarObrasClienteDeviceUseCase = new VerificarObrasClienteDeviceUseCase(
      this.iClienteDeviceRepositorio,
      this.iEnderecoRepositorio,
    );
    this.getVeiculoUseCase = new GetVeiculoUseCase(this.iLocalStorageConnection);
    this.pegarUltimoKmColetadoUsecase = new PegarUltimoKmColetadoUsecase(this.iDeviceOrdemServicoDeviceRepositorio);
  }

  verificarObrasContratoClienteOnline = async (clienteID: number, pagination: IPaginationParams) =>
    this.verificarObrasContratoClienteOnlineUseCase.execute({
      clienteID,
      pagination,
    });

  verificarObrasContratoClienteDevice = async (clienteID: number, pagination: IPaginationParams) =>
    this.verificarObrasClienteDeviceUseCase.execute({
      clienteID,
      pagination,
    });

  pegarVeiculo = async () => this.getVeiculoUseCase.execute();

  pegarUltimoKmColetado = async () => this.pegarUltimoKmColetadoUsecase.execute();
}
