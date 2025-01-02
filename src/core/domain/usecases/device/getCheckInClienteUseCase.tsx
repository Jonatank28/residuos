import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../repositories/device/clienteRepositorio';

export default class GetCheckInClienteUseCase implements UseCase<void, number | undefined | Error> {
  constructor(private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio) {}

  async execute(): Promise<number | undefined | Error> {
    try {
      const clienteID = await this.iDeviceClienteRepositorio.verificaCheckInAtivo();

      if (clienteID && clienteID !== 0) return clienteID;
    } catch (e) {
      return ApiException(e);
    }
  }
}
