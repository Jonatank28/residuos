import axiosClient from '../../../../core/axios';
import database from '../../../../core/database';
import { getAxiosConnection, ILocation, Presenter } from 'vision-common';
import ClienteRepositorio from '../../../../core/data/repositories/clienteRepositorio';
import { IClienteRepositorio } from '../../../../core/domain/repositories/clienteRepositorio';
import AtualizarLocalizacaoClienteUseCase from '../../../../core/domain/usecases/atualizarLocalizacaoClienteUseCase';
import PegarClienteDeviceUseCase from '../../../../core/domain/usecases/device/database/pegarClienteUseCase';
import PegarClienteUseCase from '../../../../core/domain/usecases/pegarClienteUseCase';
import { IDeviceLocalizacaoRepositorio } from '../../../../core/domain/repositories/device/localizacaoRepositorio';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../core/domain/repositories/device/residuoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../core/domain/repositories/device/enderecoRepositorio';
import DeviceLocalizacaoRepositorio from '../../../../core/device/repositories/localizacaoRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import DeviceResiduoRepositorio from '../../../../core/device/repositories/residuoRepositorio';
import DeviceEnderecoRepositorio from '../../../../core/device/repositories/enderecoRepositorio';
import VerificaPermissaoLocalizacaoUseCase from '../../../../core/domain/usecases/device/permissions/verificaPermissaoLocalizacaoUseCase';
import RequisitaPermissaoLocalizacaoUseCase from '../../../../core/domain/usecases/device/permissions/requisitaPermissaoLocalizacaoUseCase';
import VerificarCheckInAtivoDeviceUseCase from '../../../../core/domain/usecases/device/database/location/verificaCheckInAtivoDeviceUseCase';

export default class ClienteDetalhesPresenter extends Presenter {
  private readonly iClienteRepositorio: IClienteRepositorio;
  private readonly iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio;
  private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio;
  private readonly iResiduoRepositorio: IDeviceResiduoRepositorio;
  private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio;

  private readonly pegarClienteUseCase: PegarClienteUseCase;
  private readonly pegarClienteDeviceUseCase: PegarClienteDeviceUseCase;
  private readonly atualizarLocalizacaoClienteUseCase: AtualizarLocalizacaoClienteUseCase;
  private readonly verificaPermissaoLocalizacaoUseCase: VerificaPermissaoLocalizacaoUseCase;
  private readonly requisitaPermissaoLocalizacaoUseCase: RequisitaPermissaoLocalizacaoUseCase;
  private readonly verificarCheckInAtivoDeviceUseCase: VerificarCheckInAtivoDeviceUseCase;

  constructor(userID: number) {
    super(database);

    this.iClienteRepositorio = new ClienteRepositorio(getAxiosConnection(axiosClient));
    this.iLocalizacaoRepositorio = new DeviceLocalizacaoRepositorio(this._connection);
    this.iClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);
    this.iResiduoRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iEnderecoRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);

    this.pegarClienteUseCase = new PegarClienteUseCase(this.iClienteRepositorio);
    this.pegarClienteDeviceUseCase = new PegarClienteDeviceUseCase(
      this.iClienteDeviceRepositorio,
      this.iEnderecoRepositorio,
      this.iResiduoRepositorio,
    );
    this.atualizarLocalizacaoClienteUseCase = new AtualizarLocalizacaoClienteUseCase(this.iClienteRepositorio);
    this.verificaPermissaoLocalizacaoUseCase = new VerificaPermissaoLocalizacaoUseCase(this.iLocalizacaoRepositorio);
    this.requisitaPermissaoLocalizacaoUseCase = new RequisitaPermissaoLocalizacaoUseCase(this.iLocalizacaoRepositorio);
    this.verificarCheckInAtivoDeviceUseCase = new VerificarCheckInAtivoDeviceUseCase(this.iClienteDeviceRepositorio);
  }

  pegarCliente = async (clienteID: number) => this.pegarClienteUseCase.execute(clienteID);

  pegarClienteDevice = async (clienteID: number) => this.pegarClienteDeviceUseCase.execute(clienteID);

  atualizarLocalizacaoCliente = async (location: ILocation, clienteID: number) =>
    this.atualizarLocalizacaoClienteUseCase.execute({
      location,
      clienteID,
    });

  verificaPermisssoes = async () => this.verificaPermissaoLocalizacaoUseCase.execute();

  requisitaPermissao = async () => this.requisitaPermissaoLocalizacaoUseCase.execute();

  verificaCheckInDevice = async () => this.verificarCheckInAtivoDeviceUseCase.execute();
}
