import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';

export default class VerificarCheckInAtivoDeviceUseCase implements UseCase<void, number | void | Error> {

  constructor(private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio) { }

  async execute(): Promise<number | void | Error> {
    try {
      const clienteID = await this.iDeviceClienteRepositorio.verificaCheckInAtivo();

      if (clienteID && clienteID !== 0)
        return clienteID;
    } catch (e) {
      return ApiException(e);
    }
  };
}
