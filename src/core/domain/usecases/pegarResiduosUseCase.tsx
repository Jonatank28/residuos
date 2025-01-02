import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IResiduo } from '../entities/residuo';
import BadRequestException from '../exceptions/badRequestException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export interface IPegarResiduosParams {
  pagination: IPaginationParams;
  contratoID: number;
  clienteID: number;
}

export default class PegarResiduosUseCase implements UseCase<IPegarResiduosParams, IPaginationResponse<IResiduo> | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: IPegarResiduosParams): Promise<IPaginationResponse<IResiduo> | Error> {
    try {
      const response = await this.iResiduosRepositorio.pegarResiduos(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const {
              data, totalPaginas, pagina, total, linhas,
            } = response.data;

            return {
              items: data ?? [],
              pages: totalPaginas ?? 0,
              page: pagina ?? 0,
              length: total ?? 0,
              amount: linhas ?? 0,
              search: params.pagination.search
            };
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
