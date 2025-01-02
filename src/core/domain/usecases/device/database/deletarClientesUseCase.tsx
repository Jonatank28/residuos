import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';

export default class DeletarColetaEnviadaUseCase implements UseCase<void, void | Error> {

  constructor(private readonly iClienteRepositorio: IDeviceClienteRepositorio) { }

  async execute(): Promise<void | Error> {
    try {
      await this.iClienteRepositorio.deletarClientes();
    } catch (e) {
      return ApiException(e);
    }
  };
}
