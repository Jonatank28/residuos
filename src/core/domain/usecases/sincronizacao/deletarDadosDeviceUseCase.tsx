import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceAuditoriaRepositorio } from '../../repositories/device/auditoriaRepositorio';
import { IDeviceBalancaRepositorio } from '../../repositories/device/balancaRepositorio';
import { IDeviceClienteRepositorio } from '../../repositories/device/clienteRepositorio';
import { IDeviceMotivoRepositorio } from '../../repositories/device/deviceMotivoRepositorio';
import { IDeviceMtrPortalRepositorio } from '../../repositories/device/mtrPortalRepositorio';
import { IDeviceMtrRepositorio } from '../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';
import { IDeviceRascunhoRepositorio } from '../../repositories/device/rascunhoRepositoiro';

export default class DeletarDadosDeviceUseCase implements UseCase<boolean, boolean | void | Error> {
  constructor(
    private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio,
    private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio,
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio
  ) { }

  async execute(): Promise<void | boolean | Error> {
    try {
      console.log('DELETAR DADOS MOBILE');

      // CLIENTES
      await this.iDeviceClienteRepositorio.deletarClientes();
      await this.iDeviceClienteRepositorio.deletarObrasClientes();
      await this.iDeviceResiduoRepositorio.deletarEquipamentosClientes();
      await this.iDeviceResiduoRepositorio.deletarEquipamentosPendentesLiberacao();
      await this.iDeviceClienteRepositorio.deletarCheckInClientes();

      // MOTIVOS
      await this.iDeviceMotivoRepositorio.deletarMotivos();

      // IMOBILIZADOS
      await this.iDeviceResiduoRepositorio.deletarImobilizados();
      await this.iDeviceResiduoRepositorio.deletarImobilizadosContratos();
      await this.iDeviceResiduoRepositorio.deletarImobilizadosGenericosContratos();

      //TODOS IMOBILIZADOS
      await this.iDeviceResiduoRepositorio.deletarTodosImobilizados();

      // RESÍDUOS
      await this.iDeviceResiduoRepositorio.deletarResiduos();
      await this.iDeviceResiduoRepositorio.deletarResiduosContrato();
      await this.iDeviceResiduoRepositorio.deletarResiduosBase();

      // COLETAS
      await this.iDeviceOrdemServicoRepositorio.deletarColetasAgendadasSincronizacao();
      await this.iDeviceOrdemServicoRepositorio.deletarRotasColetasAgendadas();

      // PORTAL MTR
      await this.iDeviceMtrPortalRepositorio.deletarDadosPortal();

      // MTR
      await this.iDeviceMtrRepositorio.deletarEstadosMtrSincronizacao();

      // AUDITORIAS
      await this.iDeviceAuditoriaRepositorio.deletarAuditorias();

      // BALANÇAS
      await this.iDeviceBalancaRepositorio.deletarBalancasSincronizacao();

      // RASCUNHOS
      await this.iDeviceRascunhoRepositorio.deletarTodosRascunhosVazios();

      return true;
    } catch (e) {
      return ApiException(e);
    }
  };
}
