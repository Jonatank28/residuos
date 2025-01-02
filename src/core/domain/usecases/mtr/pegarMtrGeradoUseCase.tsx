import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IMtrGerado } from '../../entities/mtrGerado';
import { IMtrRepositorio } from '../../repositories/mtrRepositorio';

export default class PegarMtrGeradoUseCase implements UseCase<number, IMtrGerado[] | Error> {

  constructor(private readonly iMtrRepositorio: IMtrRepositorio) { }

  async execute(codigoOS: number): Promise<IMtrGerado[] | Error> {
    try {
      const response = await this.iMtrRepositorio.pegarMtrs(codigoOS);

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
