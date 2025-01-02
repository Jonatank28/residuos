import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IRota } from '../entities/rota';
import BadRequestException from '../exceptions/badRequestException';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';

export default class PegarRotasUseCase implements UseCase<string, IRota[] | Error> {

  constructor(private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio) { }

  async execute(placa: string): Promise<IRota[] | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.pegarRotas(placa);

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
