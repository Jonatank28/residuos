import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../entities/imobilizado';
import BadRequestException from '../exceptions/badRequestException';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';

export default class PegarMotivosUseCase implements UseCase<void, IImobilizado[] | Error> {

  constructor(private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio) { }

  async execute(): Promise<IImobilizado[] | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.pegarMotivos();

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
