import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IRegiao } from '../entities/regiao';
import BadRequestException from '../exceptions/badRequestException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export default class PegarRegioesUseCase implements UseCase<IPaginationParams, IPaginationResponse<IRegiao> | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) { }

  async execute(params: IPaginationParams): Promise<IPaginationResponse<IRegiao> | Error> {
    try {
      const response = await this.iClienteRepositorio.pegarRegioes(params);

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
              search: params.search,
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
