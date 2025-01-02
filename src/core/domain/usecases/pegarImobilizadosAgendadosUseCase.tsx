import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../entities/imobilizado';
import BadRequestException from '../exceptions/badRequestException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export default class PegarImobilizadosAgendadosUseCase implements UseCase<string, IImobilizado[] | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(codigosOS: string): Promise<IImobilizado[] | Error> {
    try {
      const response = await this.iResiduosRepositorio.pegarImobilizadosAgendados(codigosOS);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          return response.data;
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
