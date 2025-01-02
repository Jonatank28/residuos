import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IClienteCheckIn } from '../../../../entities/clienteCheckIn';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';

export default class PegarCheckInClientesDeviceUseCase implements UseCase<void, IClienteCheckIn[] | Error> {

  constructor(private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio) { }

  async execute(): Promise<IClienteCheckIn[] | Error> {
    try {
      let clientesCheckIn: IClienteCheckIn[] = [];

      const response = await this.iDeviceClienteRepositorio.pegarCheckInClientesDevice();

      if (response.length > 0) {
        return response._array;
      }

      return clientesCheckIn;
    } catch (e) {
      return ApiException(e);
    }
  };
}
