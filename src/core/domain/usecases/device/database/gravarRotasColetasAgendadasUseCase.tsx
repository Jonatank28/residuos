import { ApiException } from 'vision-common';
import { IRota } from '../../../entities/rota';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';

export default class GravarRotasColetasAgendadasUseCase implements UseCase<IRota[], void | Error> {

  constructor(private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio) { }

  async execute(rotas: IRota[]): Promise<void | Error> {
    try {
      for await (const rota of rotas) {
        await this.iDeviceOrdemServicoRepositorio.inserirRotaColetaAgendada(rota);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
