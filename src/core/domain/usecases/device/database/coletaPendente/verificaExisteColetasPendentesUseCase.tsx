import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';

export default class VerificaExisteColetasPendentesUseCase implements UseCase<string, number | Error> {

  constructor(private readonly iOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio) { }

  async execute(placa: string): Promise<number | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.verificaExisteColetasPendentes(placa);

      if (response && response !== 0) {
        return response;
      }

      return 0;
    } catch (e) {
      return ApiException(e);
    }
  };
}
