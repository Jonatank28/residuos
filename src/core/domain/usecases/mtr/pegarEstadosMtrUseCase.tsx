import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEstado } from '../../entities/estado';
import { IMtrRepositorio } from '../../repositories/mtrRepositorio';

export default class PegarEstadosMtrUseCase implements UseCase<void, IEstado[] | Error> {

  constructor(private readonly iMtrRepositorio: IMtrRepositorio) { }

  async execute(): Promise<IEstado[] | Error> {
    try {
      const response = await this.iMtrRepositorio.pegarEstadosMtr();

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          return response.data;
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
