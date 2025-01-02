import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { initMigration } from '../../../../device/migrations';
import { IDeviceAuditoriaRepositorio } from '../../../repositories/device/auditoriaRepositorio';
import { IDeviceBalancaRepositorio } from '../../../repositories/device/balancaRepositorio';
import { IDeviceChecklistRepositorio } from '../../../repositories/device/checklistRepositorio';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../repositories/device/imagemRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../../repositories/device/localizacaoRepositorio';
import { IDeviceMtrPortalRepositorio } from '../../../repositories/device/mtrPortalRepositorio';
import { IDeviceMtrRepositorio } from '../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';
import { IDeviceRascunhoRepositorio } from '../../../repositories/device/rascunhoRepositoiro';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class CriarTabelasUseCase implements UseCase<void, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio,
    private readonly iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
    private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio,
    private readonly iDeviceLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio,
    private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio,
  ) {}

  async execute(): Promise<void | Error> {
    try {
      await Promise.all([
        // COLETAS
        this.iDeviceOrdemServicoRepositorio.criarTabelaColetasEnviadas(),
        this.iDeviceOrdemServicoRepositorio.criarTabelaColetasAgendadas(),
        this.iDeviceOrdemServicoRepositorio.criarTabelaNovasColetas(),
        this.iDeviceOrdemServicoRepositorio.criarTabelaColetasAgendadasPendente(),
        this.iDeviceOrdemServicoRepositorio.criarTabelaRotasColetasAgendadas(),

        // MOTIVOS
        this.iDeviceMotivoRepositorio.criarTabelaMotivos(),
        this.iDeviceMotivoRepositorio.criarTabelaMotivosRecusaAssinatura(),

        // IMAGENS
        this.iDeviceImagemRepositorio.criarTabelaImagens(),
        this.iDeviceEnderecoRepositorio.criarTabelaEnderecos(),
        this.iDeviceAuditoriaRepositorio.criarTabelaAuditoria(),

        // MTR'S
        this.iDeviceMtrRepositorio.criarTabelaMtrs(),
        this.iDeviceMtrRepositorio.criarTabelaEstadosMtrs(),

        // RESÍDUOS
        this.iDeviceResiduoRepositorio.criarTabelaContainers(),
        this.iDeviceResiduoRepositorio.criarTabelaEquipamentos(),
        this.iDeviceResiduoRepositorio.criarTabelaEquipamentosClientes(),
        this.iDeviceResiduoRepositorio.criarTabelaEquipamentosPendentesLiberacao(),
        this.iDeviceResiduoRepositorio.criarTabelaResiduos(),
        this.iDeviceResiduoRepositorio.criarTabelaResiduosBase(),
        this.iDeviceResiduoRepositorio.criarTabelaResiduosContrato(),
        this.iDeviceResiduoRepositorio.criarTabelaResiduosPesagem(),

        // IMOBILIZADOS
        this.iDeviceResiduoRepositorio.criarTabelaImobilizados(),
        this.iDeviceResiduoRepositorio.criarTabelaTodosImobilizados(),
        this.iDeviceResiduoRepositorio.criarTabelaImobilizadosContratos(),
        this.iDeviceResiduoRepositorio.criarTabelaImobilizadoGenericoContratos(),

        // CLIENTES
        this.iDeviceClienteRepositorio.criarTabelaClientes(),
        this.iDeviceClienteRepositorio.criarTabelaObras(),
        this.iDeviceClienteRepositorio.criarTabelaCheckInCheckOut(),

        // CHECKLIST'S
        this.iDeviceChecklistRepositorio.criarTabelaChecklists(),
        this.iDeviceChecklistRepositorio.criarTabelaGruposChecklists(),
        this.iDeviceChecklistRepositorio.criarTabelaPerguntasGruposChecklists(),

        // RASCUNHOS
        this.iDeviceRascunhoRepositorio.criarTabelaRascunhos(),

        // MTR PORTAL
        this.iDeviceMtrPortalRepositorio.criarTabelaConfiguracaoTransportador(),
        this.iDeviceMtrPortalRepositorio.criarTabelaDadosGeradorMtrSinir(),
        this.iDeviceMtrPortalRepositorio.criarTabelaDadosTransportadorMtrSinir(),
        this.iDeviceMtrPortalRepositorio.criarTabelaEstadosFisicosPortal(),
        this.iDeviceMtrPortalRepositorio.criarTabelaFormasAcondicionamentoPortal(),
        this.iDeviceMtrPortalRepositorio.criarTabelaFormasTratamentoPortal(),
        this.iDeviceMtrPortalRepositorio.criarTabelaResiduosPortal(),
        this.iDeviceMtrPortalRepositorio.criarTabelaSubGruposPortal(),
        this.iDeviceMtrPortalRepositorio.criarTabelaUnidadesPortal(),
        this.iDeviceMtrPortalRepositorio.criarTabelaLogosEmpresas(),
        this.iDeviceMtrPortalRepositorio.criarTabelaConfiguracaoDestinador(),
        this.iDeviceMtrPortalRepositorio.criarTabelaDadosDestinador(),

        // LOCATION
        this.iDeviceLocalizacaoRepositorio.criarTabelaLocation(),

        // BALANCAS
        this.iDeviceBalancaRepositorio.criarTabelaBalancas(),
      ]);

      // MIGRATIONS
      await initMigration();
    } catch (e) {
      return ApiException(e);
    }
  }
}
