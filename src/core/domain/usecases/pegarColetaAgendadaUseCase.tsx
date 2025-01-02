import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder, setOrder } from '../entities/order';
import BadRequestException from '../exceptions/badRequestException';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';

export default class PegarColetaAgendadaUseCase implements UseCase<number, IOrder | Error> {

  constructor(private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio) {}

  async execute(codigoOS: number): Promise<IOrder | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.pegarColetaAgendada(codigoOS);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
        {
          const { data } = response;
          return setOrder(data);
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
