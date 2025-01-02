import database from '../../../../core/database';
import MtrRepositorio from '../../../../core/data/repositories/mtrRepositorio';
import DeviceMotivoRepositorio from '../../../../core/device/repositories/deviceMotivoRepositorio';
import DeviceEnderecoRepositorio from '../../../../core/device/repositories/enderecoRepositorio';
import DeviceImagemRepositorio from '../../../../core/device/repositories/imagemRepositorio';
import DeviceMtrPortalRepositorio from '../../../../core/device/repositories/mtrPortalRepositorio';
import DeviceMtrRepositorio from '../../../../core/device/repositories/mtrRepositorio';
import DeviceOrdemServicoRepositorio from '../../../../core/device/repositories/ordemServicoRepositorio';
import DeviceResiduoRepositorio from '../../../../core/device/repositories/residuoRepositorio';
import { IMtr } from '../../../../core/domain/entities/mtr';
import { IOrder } from '../../../../core/domain/entities/order';
import { IDeviceMotivoRepositorio } from '../../../../core/domain/repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceMtrPortalRepositorio } from '../../../../core/domain/repositories/device/mtrPortalRepositorio';
import { IDeviceMtrRepositorio } from '../../../../core/domain/repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../core/domain/repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../core/domain/repositories/device/residuoRepositorio';
import { IMtrRepositorio } from '../../../../core/domain/repositories/mtrRepositorio';
import AtualizarMtrDeviceUseCase from '../../../../core/domain/usecases/device/database/mtr/atualizarMtrDeviceUseCase';
import GerarMtrAuxiliarUseCase, {
  IGerarMtrAuxiliarParams,
} from '../../../../core/domain/usecases/device/database/mtr/gerarMtrAuxiliarUseCase';
import PegarColetaAgendadaOfflineUseCase from '../../../../core/domain/usecases/device/database/coletaPendente/pegarColetaAgendadaOfflineUseCase';
import PegarColetaEnviadaUseCase from '../../../../core/domain/usecases/device/database/coletaEnviada/pegarColetaEnviadaUseCase';
import PegarMtrsGeradosUseCase from '../../../../core/domain/usecases/mtr/pegarMtrsGeradosUseCase';
import PegarMtrsUseCase from '../../../../core/domain/usecases/mtr/pegarMtrsUseCase';
import { getAxiosConnection, ILocation, Presenter } from 'vision-common';
import axiosClient from '../../../../core/axios';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import PegarCheckinClientePorCodigoOSDeviceUseCase from '../../../../core/domain/usecases/device/database/checkin/pegarCheckinClientePorCodigoOS';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import AtualizarCheckoutClientePorCodigoOSDeviceUseCase from '../../../../core/domain/usecases/device/database/checkin/atualizarCheckoutClientePorCodigoOS';
import { IDeviceLocalizacaoRepositorio } from '../../../../core/domain/repositories/device/localizacaoRepositorio';
import DeviceLocalizacaoRepositorio from '../../../../core/device/repositories/localizacaoRepositorio';

export default class ColetaDetalhesLocalPresenter extends Presenter {
  private readonly iDeviceOrdemServicoDeviceRepositroio: IDeviceOrdemServicoRepositorio;
  private readonly iDeviceEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceResiduoDeviceRepositorio: IDeviceResiduoRepositorio;
  private readonly iDeviceImagemDeviceRepositoio: IDeviceImagemRepositorio;
  private readonly iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio;
  private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;
  private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio;
  private readonly iDeviceLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio;
  private readonly mtrRepositorio: IMtrRepositorio;

  private readonly PegarMtrsUseCase: PegarMtrsUseCase;
  private readonly PegarMtrsGeradosUseCase: PegarMtrsGeradosUseCase;
  private readonly PegarColetaAgendadaOfflineUseCase: PegarColetaAgendadaOfflineUseCase;
  private readonly PegarColetaEnviadaUseCase: PegarColetaEnviadaUseCase;
  private readonly AtualizarMtrDeviceUseCase: AtualizarMtrDeviceUseCase;
  private readonly GerarMtrAuxiliarUseCase: GerarMtrAuxiliarUseCase;
  private readonly pegarCheckinClientePorCodigoOSDeviceUseCase: PegarCheckinClientePorCodigoOSDeviceUseCase;
  private readonly atualizarCheckoutClientePorCodigoOSDeviceUseCase: AtualizarCheckoutClientePorCodigoOSDeviceUseCase;

  constructor(userID: number) {
    super(database);
    this.iDeviceOrdemServicoDeviceRepositroio = new DeviceOrdemServicoRepositorio(userID, this._connection);
    this.iDeviceEnderecoDeviceRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceResiduoDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iDeviceImagemDeviceRepositoio = new DeviceImagemRepositorio(userID, this._connection);
    this.iDeviceMtrDeviceRepositorio = new DeviceMtrRepositorio(userID, this._connection);
    this.iDeviceMtrPortalRepositorio = new DeviceMtrPortalRepositorio(userID, this._connection);
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);
    this.mtrRepositorio = new MtrRepositorio(getAxiosConnection(axiosClient));
    this.iDeviceLocalizacaoRepositorio = new DeviceLocalizacaoRepositorio(this._connection);
    this.iDeviceClienteRepositorio = new DeviceClienteRepositorio(userID, this._connection);

    this.PegarMtrsUseCase = new PegarMtrsUseCase(this.mtrRepositorio);
    this.PegarMtrsGeradosUseCase = new PegarMtrsGeradosUseCase(this.mtrRepositorio);
    this.PegarColetaAgendadaOfflineUseCase = new PegarColetaAgendadaOfflineUseCase(
      this.iDeviceOrdemServicoDeviceRepositroio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositoio,
      this.iDeviceResiduoDeviceRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceMotivoRepositorio,
    );
    this.PegarColetaEnviadaUseCase = new PegarColetaEnviadaUseCase(
      this.iDeviceOrdemServicoDeviceRepositroio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositoio,
      this.iDeviceResiduoDeviceRepositorio,
      this.iDeviceMtrDeviceRepositorio,
      this.iDeviceMotivoRepositorio,
    );
    this.AtualizarMtrDeviceUseCase = new AtualizarMtrDeviceUseCase(this.iDeviceMtrDeviceRepositorio);
    this.GerarMtrAuxiliarUseCase = new GerarMtrAuxiliarUseCase(this.iDeviceMtrPortalRepositorio);
    this.pegarCheckinClientePorCodigoOSDeviceUseCase = new PegarCheckinClientePorCodigoOSDeviceUseCase(
      this.iDeviceClienteRepositorio,
    );
    this.atualizarCheckoutClientePorCodigoOSDeviceUseCase = new AtualizarCheckoutClientePorCodigoOSDeviceUseCase(
      this.iDeviceClienteRepositorio,
      this.iDeviceLocalizacaoRepositorio,
    );
  }

  pegarMtrs = async (codigoOS: number) => this.PegarMtrsUseCase.execute(codigoOS);

  pegarMtrsGerados = async (codigoVinculo: string | number) => this.PegarMtrsGeradosUseCase.execute(codigoVinculo);

  pegarColetaOffline = async (codigoOS: number) => this.PegarColetaAgendadaOfflineUseCase.execute(codigoOS);

  pegarColeta = async (codigoOS: number, clienteID: number | string) =>
    this.PegarColetaEnviadaUseCase.execute({ codigoOS, clienteID });

  atualizarMtrsDevice = async (mtrs: IMtr[], coleta: IOrder) => this.AtualizarMtrDeviceUseCase.execute({ mtrs, coleta });

  gerarPDFAuxilarMtr = async (params: IGerarMtrAuxiliarParams) => this.GerarMtrAuxiliarUseCase.execute(params);

  pegarCheckinPorCodigoOS = async (codigoOS: number) => this.pegarCheckinClientePorCodigoOSDeviceUseCase.execute(codigoOS);

  atualizarCheckoutOSPorCodigo = async (codigoOS: number, dataCheckout: Date, localizacao: ILocation) =>
    this.atualizarCheckoutClientePorCodigoOSDeviceUseCase.execute({ codigoOS, dataCheckout, localizacao });
}
