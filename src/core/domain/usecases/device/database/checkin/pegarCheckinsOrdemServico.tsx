import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IClienteCheckIn } from '../../../../entities/clienteCheckIn';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';

export default class PegarCheckinsOrdemServicoDeviceUseCase implements UseCase<number, IClienteCheckIn[] | Error> {
  constructor(private readonly iClienteRepositorio: IDeviceClienteRepositorio) {}

  async execute(codigoOS: number): Promise<IClienteCheckIn[] | Error> {
    try {
      const response = await this.iClienteRepositorio.pegarCheckinsOrdemServicoDevice(codigoOS);

      return response._array ?? [];
    } catch (e) {
      return ApiException(e);
    }
  }
}
