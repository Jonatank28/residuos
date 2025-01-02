import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';

export interface IVerificarDependenciaOSParams {
  ordemID: number;
  placa: string;
}

export default class VerificarDependenciaOSUseCase implements UseCase<IVerificarDependenciaOSParams, number | Error> {

  constructor(private readonly iOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio) { }

  async execute(params: IVerificarDependenciaOSParams): Promise<number | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.verificarDependenciaOSAgendada(params);

      if (response && response !== 0) {
        return response;
      }

      return 0;
    } catch (e) {
      return ApiException(e);
    }
  };
}
