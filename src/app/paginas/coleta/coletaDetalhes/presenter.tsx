import database from '../../../../core/database';
import { getAxiosConnection, ILocation, Presenter } from 'vision-common';
import OrdemServicoRepositorio from '../../../../core/data/repositories/ordemServicoRepositorio';
import DeviceChecklistRepositorio from '../../../../core/device/repositories/checklistRepositorio';
import DeviceLocalizacaoRepositorio from '../../../../core/device/repositories/localizacaoRepositorio';
import { IChecklist } from '../../../../core/domain/entities/checklist';
import { IDeviceChecklistRepositorio } from '../../../../core/domain/repositories/device/checklistRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../../../core/domain/repositories/device/localizacaoRepositorio';
import { IOrdemServicoRepositorio } from '../../../../core/domain/repositories/ordemServicoRepositorio';
import GravarChecklistUseCase from '../../../../core/domain/usecases/device/database/gravarChecklistUseCase';
import GetCheckInClienteUseCase from '../../../../core/domain/usecases/device/getCheckInClienteUseCase';
import PegarColetaAgendadaDeviceUseCase from '../../../../core/domain/usecases/device/database/pegarColetaAgendadaUseCase';
import { IDeviceOrdemServicoRepositorio } from '../../../../core/domain/repositories/device/ordemServicoRepositorio';
import DeviceOrdemServicoRepositorio from '../../../../core/device/repositories/ordemServicoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../core/domain/repositories/device/enderecoRepositorio';
import DeviceEnderecoRepositorio from '../../../../core/device/repositories/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../core/domain/repositories/device/imagemRepositorio';
import DeviceImagemRepositorio from '../../../../core/device/repositories/imagemRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../core/domain/repositories/device/residuoRepositorio';
import DeviceResiduoRepositorio from '../../../../core/device/repositories/residuoRepositorio';
import { IDeviceMtrRepositorio } from '../../../../core/domain/repositories/device/mtrRepositorio';
import DeviceMtrRepositorio from '../../../../core/device/repositories/mtrRepositorio';
import PegarColetaAgendadaUseCase from '../../../../core/domain/usecases/pegarColetaAgendadaUseCase';
import { IDeviceMotivoRepositorio } from '../../../../core/domain/repositories/device/deviceMotivoRepositorio';
import DeviceMotivoRepositorio from '../../../../core/device/repositories/deviceMotivoRepositorio';
import VerificarDependenciaOSUseCase from '../../../../core/domain/usecases/device/database/verificarDependenciaOSUseCase';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import VerificarCheckInAtivoDeviceUseCase from '../../../../core/domain/usecases/device/database/location/verificaCheckInAtivoDeviceUseCase';
import axiosClient from '../../../../core/axios';
import PegarUltimoKmColetadoUsecase from '../../../../core/domain/usecases/device/database/km/pegarUltimoKmColetadoUseCase';

export default class ColetaDetalhesPresenter extends Presenter {
  private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio;

  private readonly iDeviceOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio;
  private readonly iDeviceEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceImagemDeviceRepositorio: IDeviceImagemRepositorio;
  private readonly iDeviceResiduoDeviceRepositorio: IDeviceResiduoRepositorio;
  private readonly iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio;
  private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;

  private readonly iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio;
  private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio;

  private readonly pegarColetaAgendadaUseCase: PegarColetaAgendadaUseCase;
  private readonly pegarColetaAgendadaDeviceUseCase: PegarColetaAgendadaDeviceUseCase;
  private readonly verificarDependenciaOSUseCase: VerificarDependenciaOSUseCase;
  private readonly getCheckInClienteUseCase: GetCheckInClienteUseCase;
  private readonly gravarChecklistUseCase: GravarChecklistUseCase;
  private readonly verificarCheckInAtivoDeviceUseCase: VerificarCheckInAtivoDeviceUseCase;
  private readonly pegarUltimoKmColetadoUsecase: PegarUltimoKmColetadoUsecase;

  constructor(userID: number) {
    super(database);

    const axiosConnection = getAxiosConnection(axiosClient);

    this.iOrdemServicoRepositorio = new OrdemServicoRepositorio(axiosConnection);

    this.iDeviceOrdemServicoDeviceRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);
    this.iDeviceEnderecoDeviceRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceImagemDeviceRepositorio = new DeviceImagemRepositorio(userID, this._connection);
    this.iDeviceResiduoDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iDeviceMtrDeviceRepositorio = new DeviceMtrRepositorio(userID, this._connection);
    this.iDeviceChecklistRepositorio = new DeviceChecklistRepositorio(userID, this._connection);
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);

    this.iLocalizacaoRepositorio = new DeviceLocalizacaoRepositorio(this._connection);
    this.iClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);

    this.pegarColetaAgendadaUseCase = new PegarColetaAgendadaUseCase(this.iOrdemServicoRepositorio);
    this.pegarColetaAgendadaDeviceUseCase = new PegarColetaAgendadaDeviceUseCase(
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositorio,
      this.iDeviceResiduoDeviceRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceChecklistRepositorio,
      this.iDeviceMotivoRepositorio,
    );
    this.verificarDependenciaOSUseCase = new VerificarDependenciaOSUseCase(this.iDeviceOrdemServicoDeviceRepositorio);
    this.getCheckInClienteUseCase = new GetCheckInClienteUseCase(this.iClienteDeviceRepositorio);
    this.gravarChecklistUseCase = new GravarChecklistUseCase(this.iDeviceChecklistRepositorio);
    this.verificarCheckInAtivoDeviceUseCase = new VerificarCheckInAtivoDeviceUseCase(this.iClienteDeviceRepositorio);
    this.pegarUltimoKmColetadoUsecase = new PegarUltimoKmColetadoUsecase(this.iDeviceOrdemServicoDeviceRepositorio);
  }

  pegarColeta = async (codigoOS: number) => this.pegarColetaAgendadaUseCase.execute(codigoOS);

  pegarColetaStorage = async (codigoOS: number) => this.pegarColetaAgendadaDeviceUseCase.execute(codigoOS);

  verificarDependenciaColeta = async (ordemID: number, placa: string) =>
    this.verificarDependenciaOSUseCase.execute({ ordemID, placa });

  verificaClienteCheckIn = async () => this.getCheckInClienteUseCase.execute();

  gravarChecklist = async (codigoOS: number, checklist: IChecklist) =>
    this.gravarChecklistUseCase.execute({ codigoOS, checklist });

  verificaCheckInDevice = async () => this.verificarCheckInAtivoDeviceUseCase.execute();

  pegarUltimoKmColetado = async () => this.pegarUltimoKmColetadoUsecase.execute();
}
