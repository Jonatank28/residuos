import { ApiException, ApiUnknownException, IPaginationParams, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IObra, setObra } from '../entities/obra';
import BadRequestException from '../exceptions/badRequestException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export interface IVerificarObrasContratoClienteOnlineUseCaseParams {
  clienteID: number;
  pagination: IPaginationParams;
}

export default class VerificarObrasContratoClienteOnlineUseCase implements UseCase<IVerificarObrasContratoClienteOnlineUseCaseParams, IObra | number | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) { }

  async execute(params: IVerificarObrasContratoClienteOnlineUseCaseParams): Promise<IObra | number | Error> {
    try {
      const response = await this.iClienteRepositorio.pegarObrasClientePaginado(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const { data } = response.data;

            if (data?.length === 1)
              return setObra(data[0]);

            return data?.length;
          }
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
