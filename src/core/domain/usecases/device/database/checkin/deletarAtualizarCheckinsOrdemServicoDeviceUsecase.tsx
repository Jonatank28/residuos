import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';

export default class DeletarAtualizarCheckinsOrdemServicoDeviceUsecase implements UseCase<number, void | Error> {
  constructor(private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio) {}

  async execute(codigoOS: number): Promise<void | Error> {
    try {
      await this.iDeviceClienteRepositorio.deletarAtualizarCheckInsOrdemServico(codigoOS);
    } catch (e) {
      return ApiException(e);
    }
  }
}
