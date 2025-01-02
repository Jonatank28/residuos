import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../entities/imobilizado';
import BadRequestException from '../exceptions/badRequestException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export interface IPegarEquipamentosUseCaseParams {
  pagination: IPaginationParams;
  contratoID?: number;
  codigosEquipamentosJaAdicionados?: number[];
}

export default class PegarEquipamentosUseCase implements UseCase<IPegarEquipamentosUseCaseParams, IPaginationResponse<IImobilizado> | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: IPegarEquipamentosUseCaseParams): Promise<IPaginationResponse<IImobilizado> | Error> {
    try {
      const response = await this.iResiduosRepositorio.pegarEquipamentos(params);

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
              search: params.pagination.search,
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
