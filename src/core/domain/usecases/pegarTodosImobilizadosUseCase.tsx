import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../entities/imobilizado';
import BadRequestException from '../exceptions/badRequestException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';
import { IPegarTodosImobilizadosUseCaseParametros } from './device/database/pegarTodosImobilizadosUseCase';

export default class PegarTodosImobilizadosUseCase implements UseCase<IPegarTodosImobilizadosUseCaseParametros, IPaginationResponse<IImobilizado> | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: IPegarTodosImobilizadosUseCaseParametros): Promise<IPaginationResponse<IImobilizado> | Error> {
    try {
      const response = await this.iResiduosRepositorio.pegarTodosImobilizados(params);

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
              search: params.paginacao.search,
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
