import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ICliente, setCliente } from '../entities/cliente';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export default class PegarClienteUseCase implements UseCase<number, ICliente | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) {}

  async execute(clienteID: number): Promise<ICliente | Error> {
    try {
      const response = await this.iClienteRepositorio.pegarCliente(clienteID);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
        {
          const { data } = response;
          return setCliente(data);
        }
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
