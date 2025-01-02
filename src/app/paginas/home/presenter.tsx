import database from '../../../core/database';
import QuestionarioRepositorio from 'vision-questionario/src/core/data/repositories/questionarioRepositorio';
import { IQuestionarioRepositorio } from 'vision-questionario/src/core/domain';
import VerificarQuestionarioUseCase from 'vision-questionario/src/core/domain/usecases/verificarQuestionarioUseCase';
import AutenticacaoRepositorio from '../../../core/data/repositories/autenticacaoRepositorio';
import DeviceChecklistRepositorio from '../../../core/device/repositories/checklistRepositorio';
import DeviceClienteRepositorio from '../../../core/device/repositories/clienteRepositorio';
import DeviceMotivoRepositorio from '../../../core/device/repositories/deviceMotivoRepositorio';
import DeviceEnderecoRepositorio from '../../../core/device/repositories/enderecoRepositorio';
import DeviceImagemRepositorio from '../../../core/device/repositories/imagemRepositorio';
import DeviceMtrPortalRepositorio from '../../../core/device/repositories/mtrPortalRepositorio';
import DeviceMtrRepositorio from '../../../core/device/repositories/mtrRepositorio';
import DeviceOrdemServicoRepositorio from '../../../core/device/repositories/ordemServicoRepositorio';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';
import { IAuditoria } from '../../../core/domain/entities/auditoria';
import { ICliente } from '../../../core/domain/entities/cliente';
import { IClienteCheckIn } from '../../../core/domain/entities/clienteCheckIn';
import { IEquipamento } from '../../../core/domain/entities/equipamento';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';
import { IMotivo } from '../../../core/domain/entities/motivo';
import { IObra } from '../../../core/domain/entities/obra';
import { IOrder } from '../../../core/domain/entities/order';
import { IConfiguracaoDestinador, IDadosDestinador } from '../../../core/domain/entities/portalMtr/dadosDestinador';
import { IConfiguracaoTransportador, IDadosTransportador } from '../../../core/domain/entities/portalMtr/dadosTransportador';
import { ILogoEmpresa } from '../../../core/domain/entities/portalMtr/logoEmpresa';
import {
  IEstadoFisicoPortal,
  IFormaAcondicionamentoPortal,
  IFormaTratamentoPortal,
  IResiduoPortal,
  ISubGrupoPortal,
  IUnidadePortal,
} from '../../../core/domain/entities/portalMtr/portal';
import { IRegiao } from '../../../core/domain/entities/regiao';
import { IResiduo } from '../../../core/domain/entities/residuo';
import { IRota } from '../../../core/domain/entities/rota';
import { IAutenticacaoRepositorio } from '../../../core/domain/repositories/autenticacaoRepositorio';
import { IDeviceChecklistRepositorio } from '../../../core/domain/repositories/device/checklistRepositorio';
import { IDeviceClienteRepositorio } from '../../../core/domain/repositories/device/clienteRepositorio';
import { IDeviceMotivoRepositorio } from '../../../core/domain/repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceMtrPortalRepositorio } from '../../../core/domain/repositories/device/mtrPortalRepositorio';
import { IDeviceMtrRepositorio } from '../../../core/domain/repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../core/domain/repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import DeletarColetasEnviadas5DiasDeviceUseCase from '../../../core/domain/usecases/device/database/coletaEnviada/deletarColetasEnviadas5DiasDeviceUseCase';
import GravarClientesUseCase from '../../../core/domain/usecases/device/database/gravarClientesUseCase';
import GravarEquipamentosClienteUseCase from '../../../core/domain/usecases/device/database/gravarEquipamentosClienteUseCase';
import GravarImobilizadosUseCase from '../../../core/domain/usecases/device/database/gravarImobilizadosUseCase';
import GravarMotivosUseCase from '../../../core/domain/usecases/device/database/gravarMotivosUseCase';
import GravarObrasClienteUseCase from '../../../core/domain/usecases/device/database/gravarObraClienteUseCase';
import GravarResiduoBaseUseCase from '../../../core/domain/usecases/sincronizacao/gravarResiduoBaseUseCase';
import GravarResiduoContratoUseCase from '../../../core/domain/usecases/sincronizacao/gravarResiduoContratoUseCase';
import GravarResiduoUseCase from '../../../core/domain/usecases/sincronizacao/gravarResiduoUseCase';
import GravarRotasColetasAgendadasUseCase from '../../../core/domain/usecases/device/database/gravarRotasColetasAgendadasUseCase';
import PegarCheckInClientesDeviceUseCase from '../../../core/domain/usecases/device/database/location/pegarCheckInClientesDeviceUseCase';
import GravarConfiguracoesDestinadorMtrDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarConfiguracoesDestinadorMtrUseCase';
import GravarConfiguracoesTransportadorMtrDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarConfiguracoesTransportadorMtrUseCase';
import GravarDadosDestinadorMtrDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarDadosDestinadorMtrUseCase';
import GravarDadosGeradorMtrDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarDadosGeradorMtrUseCase';
import GravarDadosTransportadorMtrDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarDadosTransportadorMtrUseCase';
import GravarEstadosFisicosPortalDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarEstadosFisicosPortalUseCase';
import GravarFormasAcondicionamentoPortalDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarFormasAcondicionamentoPortalUseCase';
import GravarFormasTratamentoPortalDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarFormasTratamentoPortalUseCase';
import GravarLogosEmpresasDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarLogosEmpresasUseCase';
import GravarResiduosPortalDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarResiduosPortalUseCase';
import GravarSubGruposPortalDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarSubGruposPortalUseCase';
import GravarUnidadesPortalDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/gravarUnidadesPortalUseCase';
import GetBloqueioVersaoUseCase from '../../../core/domain/usecases/device/getBloqueioVersaoUseCase';
import GetRegioesUseCase from '../../../core/domain/usecases/device/getRegioesUseCase';
import GetVeiculoUseCase from '../../../core/domain/usecases/device/getVeiculoUseCase';
import SetHasPlacaAlteradaUseCase from '../../../core/domain/usecases/device/setHasPlacaAlteradaUseCase';
import VerificaPlacaAlteradaUseCase from '../../../core/domain/usecases/device/verificaPlacaAlteradaUseCase';
import EnviarDadosUseCase from '../../../core/domain/usecases/enviarDadosUseCase';
import PegarDadosUseCase from '../../../core/domain/usecases/pegarDadosUseCase';
import PegarVersaoRestUseCase from '../../../core/domain/usecases/pegarVersaoRestUseCase';
import { getAxiosConnection, ILocalStorageConnection, Presenter } from 'vision-common';
import DeletarDadosDeviceUseCase from '../../../core/domain/usecases/sincronizacao/deletarDadosDeviceUseCase';
import { IDeviceAuditoriaRepositorio } from '../../../core/domain/repositories/device/auditoriaRepositorio';
import DeviceAuditoriaRepositorio from '../../../core/device/repositories/auditoriaRepositorio';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../../core/axios';
import GravarColetasAgendadasDeviceUseCase from '../../../core/domain/usecases/sincronizacao/gravarColetasAgendadasDeviceUseCase';
import PegarDadosDispositivoDeviceUseCase from '../../../core/domain/usecases/sincronizacao/pegarDadosDispositivoDeviceUseCase';
import FazerBackupAutomaticoUseCase from '../../../core/domain/usecases/fazerBackupAutomaticoUseCase';
import GravarEstadosMTRDeviceUseCase from '../../../core/domain/usecases/sincronizacao/gravarEstadosMTRDeviceUseCase';
import { IEstado } from '../../../core/domain/entities/estado';
import GravarImobilizadosContratosUseCase from '../../../core/domain/usecases/device/database/gravarImobilizadosContratosUseCase';
import { IDeviceBalancaRepositorio } from '../../../core/domain/repositories/device/balancaRepositorio';
import UsecaseCadastrarBalanca from '../../../core/domain/usecases/device/database/balanca/usecaseCadastrarBalanca';
import DeviceBalancaRepositorio from '../../../core/device/repositories/balancaRepositorio';
import { IBalanca } from '../../../core/domain/entities/balanca/balanca';
import UsecasePegarBalancasCadastradasMobile from '../../../core/domain/usecases/device/database/balanca/usecasePegarBalancasCadastradasMobile';
import { IDeviceRascunhoRepositorio } from '../../../core/domain/repositories/device/rascunhoRepositoiro';
import DeviceRascunhoRepositorio from '../../../core/device/repositories/rascunhoRepositorio';
import GravarMovimentacaoEquipamentosPendentesLiberacaoUseCase from '../../../core/domain/usecases/sincronizacao/gravarEquipamentosPendentesLiberacaoUseCase';
import { IMovimentacaoEtapaEquipamento } from '../../../core/domain/entities/movimentacaoEtapaEquipamento';
import PegarCheckinsOrdemServicoDeviceUseCase from '../../../core/domain/usecases/device/database/checkin/pegarCheckinsOrdemServico';
import DeletarAtualizarCheckinsOrdemServicoDeviceUsecase from '../../../core/domain/usecases/device/database/checkin/deletarAtualizarCheckinsOrdemServicoDeviceUsecase';
import GravarImobilizadosGenericosContratosUseCase from '../../../core/domain/usecases/sincronizacao/gravaImobilizadosGenericosContratosUseCase';
import { IImobilizadoGenericoContrato } from '../../../core/domain/entities/imobilizadoGenericoContrato';
import DeletarColetasAgendadasSincronizacaoUseCase from '../../../core/domain/usecases/sincronizacao/deletarColetasAgendadasSincronizacaoUseCase';
import { IPegarTodosImobilizadosUseCaseParametros } from '../../../core/domain/usecases/device/database/pegarTodosImobilizadosUseCase';
import PegarTodosImobilizadosUseCase from '../../../core/domain/usecases/pegarTodosImobilizadosUseCase';
import { IResiduosRepositorio } from '../../../core/domain/repositories/residuosRepositorio';
import ResiduosRepositorio from '../../../core/data/repositories/residuosRepositorio';

export default class HomePresenter extends Presenter {
  private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio;
  private readonly iQuestionarioRepositorio: IQuestionarioRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iDeviceClienteDeviceRepositorio: IDeviceClienteRepositorio;
  private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio;
  private readonly iResiduosRepositorio: IResiduosRepositorio;
  private readonly iDeviceEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio;
  private readonly iDeviceImagemDeviceRepositoio: IDeviceImagemRepositorio;
  private readonly iDeviceOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio;
  private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio;
  private readonly iDeviceCheckDevicelistRepositorio: IDeviceChecklistRepositorio;
  private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio;
  private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio;
  private readonly iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio;
  private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio;
  private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio;
  private readonly pegarCheckInClientesDeviceUseCase: PegarCheckInClientesDeviceUseCase;
  private readonly deletarColetasEnviadas5DiasDeviceUseCase: DeletarColetasEnviadas5DiasDeviceUseCase;
  private readonly getBloqueioVersaoUseCase: GetBloqueioVersaoUseCase;
  private readonly pegarVersaoRestUseCase: PegarVersaoRestUseCase;
  private readonly gravarRotasColetasAgendadasUseCase: GravarRotasColetasAgendadasUseCase;
  private readonly gravarColetasAgendadasDeviceUseCase: GravarColetasAgendadasDeviceUseCase;
  private readonly gravarMotivosUseCase: GravarMotivosUseCase;
  private readonly verificarQuestionarioUseCase: VerificarQuestionarioUseCase;
  private readonly gravarObrasClienteUseCase: GravarObrasClienteUseCase;
  private readonly getVeiculoUseCase: GetVeiculoUseCase;
  private readonly verificaPlacaAlteradaUseCase: VerificaPlacaAlteradaUseCase;
  private readonly getRegioesUseCase: GetRegioesUseCase;
  private readonly enviarDadosUseCase: EnviarDadosUseCase;
  private readonly pegarDadosUseCase: PegarDadosUseCase;
  private readonly setHasPlacaAlteradaUseCase: SetHasPlacaAlteradaUseCase;
  private readonly gravarResiduoUseCase: GravarResiduoUseCase;
  private readonly gravarResiduoContratoUseCase: GravarResiduoContratoUseCase;
  private readonly gravarResiduoBaseUseCase: GravarResiduoBaseUseCase;
  private readonly gravarImobilizadosUseCase: GravarImobilizadosUseCase;
  private readonly gravarEquipamentosClienteUseCase: GravarEquipamentosClienteUseCase;
  private readonly gravarClientesUseCase: GravarClientesUseCase;
  private readonly gravarConfiguracoesTransportadorMtrDeviceUseCase: GravarConfiguracoesTransportadorMtrDeviceUseCase;
  private readonly gravarDadosGeradorMtrDeviceUseCase: GravarDadosGeradorMtrDeviceUseCase;
  private readonly gravarDadosTransportadorMtrDeviceUseCase: GravarDadosTransportadorMtrDeviceUseCase;
  private readonly gravarEstadosFisicosPortalDeviceUseCase: GravarEstadosFisicosPortalDeviceUseCase;
  private readonly gravarFormasAcondicionamentoPortalDeviceUseCase: GravarFormasAcondicionamentoPortalDeviceUseCase;
  private readonly gravarFormasTratamentoPortalDeviceUseCase: GravarFormasTratamentoPortalDeviceUseCase;
  private readonly gravarSubGruposPortalDeviceUseCase: GravarSubGruposPortalDeviceUseCase;
  private readonly gravarResiduosPortalDeviceUseCase: GravarResiduosPortalDeviceUseCase;
  private readonly gravarUnidadesPortalDeviceUseCase: GravarUnidadesPortalDeviceUseCase;
  private readonly gravarLogosEmpresasDeviceUseCase: GravarLogosEmpresasDeviceUseCase;
  private readonly gravarConfiguracoesDestinadorMtrDeviceUseCase: GravarConfiguracoesDestinadorMtrDeviceUseCase;
  private readonly gravarDadosDestinadorMtrDeviceUseCase: GravarDadosDestinadorMtrDeviceUseCase;
  private readonly pegarDadosDispositivoDeviceUseCase: PegarDadosDispositivoDeviceUseCase;
  private readonly deletarDadosDeviceUseCase: DeletarDadosDeviceUseCase;
  private readonly deletarColetasAgendadasSincronizacaoUseCase: DeletarColetasAgendadasSincronizacaoUseCase;
  private readonly fazerBackupAutomaticoUseCase: FazerBackupAutomaticoUseCase;
  private readonly gravarEstadosMTRDeviceUseCase: GravarEstadosMTRDeviceUseCase;
  private readonly gravarImobilizadosContratosUseCase: GravarImobilizadosContratosUseCase;
  private readonly usecaseCadastrarBalanca: UsecaseCadastrarBalanca;
  private readonly usecasePegarBalancasCadastradasMobile: UsecasePegarBalancasCadastradasMobile;
  private readonly gravarMovimentacaoEquipamentosPendentesLiberacaoUseCase: GravarMovimentacaoEquipamentosPendentesLiberacaoUseCase;
  private readonly pegarCheckinsOrdemServicoDeviceUseCase: PegarCheckinsOrdemServicoDeviceUseCase;
  private readonly deletarAtualizarCheckinsOrdemServicoDeviceUsecase: DeletarAtualizarCheckinsOrdemServicoDeviceUsecase;
  private readonly gravarImobilizadosGenericosContratosUseCase: GravarImobilizadosGenericosContratosUseCase;
  private readonly pegarTodosImobilizadosUseCase: PegarTodosImobilizadosUseCase;

  constructor(private readonly userID: number) {
    super(database);

    this.iAutenticacaoRepositorio = new AutenticacaoRepositorio(getAxiosConnection(axiosClient));
    this.iQuestionarioRepositorio = new QuestionarioRepositorio();
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iDeviceClienteDeviceRepositorio = new DeviceClienteRepositorio(userID, this._connection);
    this.iDeviceResiduoRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.iResiduosRepositorio = new ResiduosRepositorio(getAxiosConnection(axiosClient));
    this.iDeviceEnderecoDeviceRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);
    this.iDeviceImagemDeviceRepositoio = new DeviceImagemRepositorio(userID, this._connection);
    this.iDeviceOrdemServicoDeviceRepositorio = new DeviceOrdemServicoRepositorio(userID, this._connection);
    this.iDeviceMtrRepositorio = new DeviceMtrRepositorio(userID, this._connection);
    this.iDeviceCheckDevicelistRepositorio = new DeviceChecklistRepositorio(userID, this._connection);
    this.iDeviceMotivoRepositorio = new DeviceMotivoRepositorio(userID, this._connection);
    this.iDeviceMtrPortalRepositorio = new DeviceMtrPortalRepositorio(userID, this._connection);
    this.iDeviceAuditoriaRepositorio = new DeviceAuditoriaRepositorio(userID, this._connection);
    this.iDeviceBalancaRepositorio = new DeviceBalancaRepositorio(userID, this._connection);
    this.iDeviceRascunhoRepositorio = new DeviceRascunhoRepositorio(userID, this._connection);

    this.pegarCheckInClientesDeviceUseCase = new PegarCheckInClientesDeviceUseCase(this.iDeviceClienteDeviceRepositorio);
    this.deletarColetasEnviadas5DiasDeviceUseCase = new DeletarColetasEnviadas5DiasDeviceUseCase(
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceImagemDeviceRepositoio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceMotivoRepositorio,
      this.iDeviceMtrRepositorio,
    );
    this.getBloqueioVersaoUseCase = new GetBloqueioVersaoUseCase(this.iLocalStorageConnection);
    this.pegarVersaoRestUseCase = new PegarVersaoRestUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
    this.gravarRotasColetasAgendadasUseCase = new GravarRotasColetasAgendadasUseCase(this.iDeviceOrdemServicoDeviceRepositorio);
    this.gravarColetasAgendadasDeviceUseCase = new GravarColetasAgendadasDeviceUseCase(
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceMtrRepositorio,
      this.iDeviceCheckDevicelistRepositorio,
    );
    this.gravarMotivosUseCase = new GravarMotivosUseCase(this.iDeviceMotivoRepositorio);
    this.verificarQuestionarioUseCase = new VerificarQuestionarioUseCase(
      this.iQuestionarioRepositorio,
      this.iLocalStorageConnection,
    );
    this.gravarObrasClienteUseCase = new GravarObrasClienteUseCase(
      this.iDeviceClienteDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
    );
    this.getVeiculoUseCase = new GetVeiculoUseCase(this.iLocalStorageConnection);
    this.verificaPlacaAlteradaUseCase = new VerificaPlacaAlteradaUseCase(this.iLocalStorageConnection);
    this.getRegioesUseCase = new GetRegioesUseCase(this.iLocalStorageConnection);
    this.enviarDadosUseCase = new EnviarDadosUseCase(this.iAutenticacaoRepositorio);
    this.pegarDadosUseCase = new PegarDadosUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
    this.setHasPlacaAlteradaUseCase = new SetHasPlacaAlteradaUseCase(this.iLocalStorageConnection);
    this.gravarResiduoUseCase = new GravarResiduoUseCase(this.iDeviceResiduoRepositorio);
    this.gravarResiduoContratoUseCase = new GravarResiduoContratoUseCase(this.iDeviceResiduoRepositorio);
    this.gravarResiduoBaseUseCase = new GravarResiduoBaseUseCase(this.iDeviceResiduoRepositorio);
    this.gravarImobilizadosUseCase = new GravarImobilizadosUseCase(this.iDeviceResiduoRepositorio);
    this.gravarEquipamentosClienteUseCase = new GravarEquipamentosClienteUseCase(this.iDeviceResiduoRepositorio);
    this.gravarClientesUseCase = new GravarClientesUseCase(
      this.iDeviceClienteDeviceRepositorio,
      this.iDeviceEnderecoDeviceRepositorio,
      this.iDeviceResiduoRepositorio,
    );
    this.gravarConfiguracoesTransportadorMtrDeviceUseCase = new GravarConfiguracoesTransportadorMtrDeviceUseCase(
      this.iDeviceMtrPortalRepositorio,
    );
    this.gravarDadosGeradorMtrDeviceUseCase = new GravarDadosGeradorMtrDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.gravarDadosTransportadorMtrDeviceUseCase = new GravarDadosTransportadorMtrDeviceUseCase(
      this.iDeviceMtrPortalRepositorio,
    );
    this.gravarEstadosFisicosPortalDeviceUseCase = new GravarEstadosFisicosPortalDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.gravarFormasAcondicionamentoPortalDeviceUseCase = new GravarFormasAcondicionamentoPortalDeviceUseCase(
      this.iDeviceMtrPortalRepositorio,
    );
    this.gravarFormasTratamentoPortalDeviceUseCase = new GravarFormasTratamentoPortalDeviceUseCase(
      this.iDeviceMtrPortalRepositorio,
    );
    this.gravarSubGruposPortalDeviceUseCase = new GravarSubGruposPortalDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.gravarResiduosPortalDeviceUseCase = new GravarResiduosPortalDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.gravarUnidadesPortalDeviceUseCase = new GravarUnidadesPortalDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.gravarLogosEmpresasDeviceUseCase = new GravarLogosEmpresasDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.gravarConfiguracoesDestinadorMtrDeviceUseCase = new GravarConfiguracoesDestinadorMtrDeviceUseCase(
      this.iDeviceMtrPortalRepositorio,
    );
    this.gravarDadosDestinadorMtrDeviceUseCase = new GravarDadosDestinadorMtrDeviceUseCase(this.iDeviceMtrPortalRepositorio);
    this.deletarDadosDeviceUseCase = new DeletarDadosDeviceUseCase(
      this.iDeviceClienteDeviceRepositorio,
      this.iDeviceResiduoRepositorio,
      this.iDeviceMotivoRepositorio,
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceMtrPortalRepositorio,
      this.iDeviceMtrRepositorio,
      this.iDeviceAuditoriaRepositorio,
      this.iDeviceBalancaRepositorio,
      this.iDeviceRascunhoRepositorio,
    );
    this.deletarColetasAgendadasSincronizacaoUseCase = new DeletarColetasAgendadasSincronizacaoUseCase(
      this.iDeviceResiduoRepositorio,
      this.iDeviceOrdemServicoDeviceRepositorio,
      this.iDeviceRascunhoRepositorio

    );
    this.pegarDadosDispositivoDeviceUseCase = new PegarDadosDispositivoDeviceUseCase(
      this.iDeviceAuditoriaRepositorio,
      this.iLocalStorageConnection,
    );
    this.fazerBackupAutomaticoUseCase = new FazerBackupAutomaticoUseCase(this.iAutenticacaoRepositorio);
    this.gravarEstadosMTRDeviceUseCase = new GravarEstadosMTRDeviceUseCase(this.iDeviceMtrRepositorio);
    this.gravarImobilizadosContratosUseCase = new GravarImobilizadosContratosUseCase(this.iDeviceResiduoRepositorio);
    this.usecaseCadastrarBalanca = new UsecaseCadastrarBalanca(this.iDeviceBalancaRepositorio);
    this.usecasePegarBalancasCadastradasMobile = new UsecasePegarBalancasCadastradasMobile(this.iDeviceBalancaRepositorio);
    this.gravarMovimentacaoEquipamentosPendentesLiberacaoUseCase = new GravarMovimentacaoEquipamentosPendentesLiberacaoUseCase(
      this.iDeviceResiduoRepositorio,
    );
    this.pegarCheckinsOrdemServicoDeviceUseCase = new PegarCheckinsOrdemServicoDeviceUseCase(
      this.iDeviceClienteDeviceRepositorio,
    );

    this.deletarAtualizarCheckinsOrdemServicoDeviceUsecase = new DeletarAtualizarCheckinsOrdemServicoDeviceUsecase(
      this.iDeviceClienteDeviceRepositorio,
    );

    this.gravarImobilizadosGenericosContratosUseCase = new GravarImobilizadosGenericosContratosUseCase(
      this.iDeviceResiduoRepositorio,
    );
    this.pegarTodosImobilizadosUseCase = new PegarTodosImobilizadosUseCase(this.iResiduosRepositorio);
  }

  pegarCheckInClientesDevice = async () => this.pegarCheckInClientesDeviceUseCase.execute();

  pegarCheckinsPorCodigoOS = async (codigoOS: number) => this.pegarCheckinsOrdemServicoDeviceUseCase.execute(codigoOS);

  deletarCheckinsOrdemServico = async (codigoOS: number) =>
    this.deletarAtualizarCheckinsOrdemServicoDeviceUsecase.execute(codigoOS);

  deletarColetasEnviadas5Dias = async () => this.deletarColetasEnviadas5DiasDeviceUseCase.execute();

  limpaDadosSincronizacao = async () => this.deletarColetasAgendadasSincronizacaoUseCase.execute();

  verificarBloqueioVersao = async () => this.getBloqueioVersaoUseCase.execute();

  pegarVersaoRest = async (bloqueiaVersao?: boolean) => this.pegarVersaoRestUseCase.execute(bloqueiaVersao);

  gravarRotasColetasAgendadas = async (rotas: IRota[]) => this.gravarRotasColetasAgendadasUseCase.execute(rotas);


  gravarColetasAgendadas = async (coletas: IOrder[]) =>
    this.gravarColetasAgendadasDeviceUseCase.execute({ coletas, userID: this.userID });

  gravarMotivos = async (motivos: IMotivo[]) => this.gravarMotivosUseCase.execute(motivos);

  verificarQuestionario = async (placa: string) => this.verificarQuestionarioUseCase.execute(placa);

  gravarObraCliente = async (obras: IObra[]) => this.gravarObrasClienteUseCase.execute({ obras, userID: this.userID });

  getVeiculo = async () => this.getVeiculoUseCase.execute();

  verificaPlacaAlterada = async () => this.verificaPlacaAlteradaUseCase.execute();

  getRegioes = async () => this.getRegioesUseCase.execute();

  enviarDados = async (
    auditorias: IAuditoria[],
    balancas: IBalanca[],
    checkInClientes: IClienteCheckIn[],
    fotoUsuario?: string,
  ) =>
    await this.enviarDadosUseCase.execute({
      auditorias,
      balancas,
      checkInClientes,
      fotoUsuario,
    });

  pegarDados = async (regioes: IRegiao[], placa: string, placaID: number) =>
    this.pegarDadosUseCase.execute({ regioes, placa, placaID });

  sincronizacaoOK = async (placa: string) => this.setHasPlacaAlteradaUseCase.execute(placa);

  gravarResiduoDevice = async (residuos: IResiduo[]) => this.gravarResiduoUseCase.execute({ residuos, userID: this.userID });

  gravarResiduoContratoDevice = async (residuos: IResiduo[]) =>
    this.gravarResiduoContratoUseCase.execute({ residuosContrato: residuos, userID: this.userID });

  gravarResiduoBaseDevice = async (residuos: IResiduo[]) =>
    this.gravarResiduoBaseUseCase.execute({ residuosBase: residuos, userID: this.userID });

  gravarImobilizadosDevice = async (imobilizados: IImobilizado[]) =>
    this.gravarImobilizadosUseCase.execute({ imobilizados, userID: this.userID });

  gravarTodosImobilizadosDevice = async (imobilizados: IImobilizado[],) =>
    this.gravarImobilizadosUseCase.execute({ imobilizados, userID: this.userID, mostraImobilizadoTelaResiduosAPP: true });

  gravarEquipamentosClienteDevice = async (equipamentos: IEquipamento[]) =>
    this.gravarEquipamentosClienteUseCase.execute(equipamentos);

  gravarEquipamentosPendentesLiberacaoDevice = async (equipamentosPendentes: IMovimentacaoEtapaEquipamento[]) =>
    this.gravarMovimentacaoEquipamentosPendentesLiberacaoUseCase.execute({
      equipamentosPendentes: equipamentosPendentes,
      userID: this.userID,
    });

  gravarClienteDevice = async (clientes: ICliente[]) => this.gravarClientesUseCase.execute({ clientes, userID: this.userID });

  gravarConfiguracoesTransportador = async (configuracoes: IConfiguracaoTransportador[]) =>
    this.gravarConfiguracoesTransportadorMtrDeviceUseCase.execute({ configuracoes, userID: this.userID });

  gravarDadosGerador = async (dadosGerador: IConfiguracaoTransportador[]) =>
    this.gravarDadosGeradorMtrDeviceUseCase.execute({ dadosGerador, userID: this.userID });

  gravarDadosTransportador = async (dadosTransportador: IDadosTransportador[]) =>
    this.gravarDadosTransportadorMtrDeviceUseCase.execute({ dadosTransportador, userID: this.userID });

  gravarEstadosFisicosPortal = async (estadosFisicos: IEstadoFisicoPortal[]) =>
    this.gravarEstadosFisicosPortalDeviceUseCase.execute({ estadosFisicos, userID: this.userID });

  gravarFormasAcondicionamentoPortal = async (formasAcondicionamento: IFormaAcondicionamentoPortal[]) =>
    this.gravarFormasAcondicionamentoPortalDeviceUseCase.execute({ formasAcondicionamento, userID: this.userID });

  gravarFormasTratamentoPortal = async (formasTratamento: IFormaTratamentoPortal[]) =>
    this.gravarFormasTratamentoPortalDeviceUseCase.execute({ formasTratamento, userID: this.userID });

  gravarResiduosPortal = async (residuosPortal: IResiduoPortal[]) =>
    this.gravarResiduosPortalDeviceUseCase.execute({ residuosPortal, userID: this.userID });

  gravarSubGruposPortal = async (subGruposPortal: ISubGrupoPortal[]) =>
    this.gravarSubGruposPortalDeviceUseCase.execute({ subGruposPortal, userID: this.userID });

  gravarUnidadesPortal = async (unidadesPortal: IUnidadePortal[]) =>
    this.gravarUnidadesPortalDeviceUseCase.execute({ unidadesPortal, userID: this.userID });

  gravarLogosEmpresas = async (logosEmpresas: ILogoEmpresa[]) =>
    this.gravarLogosEmpresasDeviceUseCase.execute({ logosEmpresas, userID: this.userID });

  gravarConfiguracoesDestinadorMtr = async (configuracoes: IConfiguracaoDestinador[]) =>
    this.gravarConfiguracoesDestinadorMtrDeviceUseCase.execute({ configuracoes, userID: this.userID });

  gravarDadosDestinador = async (dadosDestinadores: IDadosDestinador[]) =>
    this.gravarDadosDestinadorMtrDeviceUseCase.execute({ dadosDestinadores, userID: this.userID });

  pegarDadosTotaisDispositivo = async (placa: string) => this.pegarDadosDispositivoDeviceUseCase.execute(placa);

  deletarDadosDevice = async () => this.deletarDadosDeviceUseCase.execute();

  fazerBackupAutomatico = async (formData: FormData) => this.fazerBackupAutomaticoUseCase.execute(formData);

  gravarEstadosMTRDevice = async (estados: IEstado[]) =>
    this.gravarEstadosMTRDeviceUseCase.execute({ estados, userID: this.userID });

  gravarImobilizadoGenericoContratoDevice = async (imobilizadosGenericosContratos: IImobilizadoGenericoContrato[]) =>
    this.gravarImobilizadosGenericosContratosUseCase.execute({ imobilizadosGenericosContratos, userID: this.userID });

  gravarImobilizadosContratos = async (imobilizados: IImobilizado[]) =>
    this.gravarImobilizadosContratosUseCase.execute({ userID: this.userID, imobilizados });

  gravarBalanca = async (balanca: IBalanca) => this.usecaseCadastrarBalanca.execute(balanca);

  pegarBalancasCadastradasMobile = async () => this.usecasePegarBalancasCadastradasMobile.execute();

  pegarTodosImobilizados = async (params: IPegarTodosImobilizadosUseCaseParametros) => this.pegarTodosImobilizadosUseCase.execute(params);

}
