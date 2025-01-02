import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';
import { IDeviceRascunhoRepositorio } from '../../repositories/device/rascunhoRepositoiro';

export default class DeletarColetasAgendadasSincronizacaoUseCase implements UseCase<boolean, boolean | void | Error> {
  constructor(
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio
  ) { }

  async execute(): Promise<void | boolean | Error> {
    try {
      console.log('DELETAR DADOS COLETAS AGENDADAS SINCRONIZACAO');

      // RESÍDUOS
      await this.iDeviceResiduoRepositorio.deletarResiduos();
      await this.iDeviceResiduoRepositorio.deletarResiduosContrato();
      await this.iDeviceResiduoRepositorio.deletarResiduosBase();

      //IMOBILIZADOS
      await this.iDeviceResiduoRepositorio.deletarTodosImobilizados();

      // COLETAS
      await this.iDeviceOrdemServicoRepositorio.deletarColetasAgendadasSincronizacao();
      await this.iDeviceOrdemServicoRepositorio.deletarRotasColetasAgendadas();

      // RASCUNHOS
      await this.iDeviceRascunhoRepositorio.deletarTodosRascunhosVazios();

      return true;
    } catch (e) {
      return ApiException(e);
    }
  };
}
