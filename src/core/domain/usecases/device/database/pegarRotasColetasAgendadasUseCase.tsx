import { ApiException } from 'vision-common';
import { IRota } from '../../../entities/rota';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';

export default class PegarRotasColetasAgendadasUseCase implements UseCase<void, IRota[] | Error> {

  constructor(private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio) { }

  async execute(): Promise<IRota[] | Error> {
    try {
      let rotas: IRota[] = [];
      const response = await this.iDeviceOrdemServicoRepositorio.pegarRotasColetasAgendadas();

      if (response.length > 0) {
        rotas = response._array;
      }

      return rotas;
    } catch (e) {
      return ApiException(e);
    }
  };
}
