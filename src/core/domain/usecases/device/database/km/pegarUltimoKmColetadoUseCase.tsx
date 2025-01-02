import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';

export default class PegarUltimoKmColetadoUsecase implements UseCase<void, number | Error> {
  constructor(private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio) {}

  async execute(): Promise<number | Error> {
    try {
      const response = await this.iDeviceOrdemServicoRepositorio.pegarUltimoKmColetado();

      return response || 0;
    } catch (e) {
      return ApiException(e);
    }
  }
}
