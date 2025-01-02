import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, IVeiculo, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IVeiculoRepositorio } from '../repositories/veiculosRepositorio';

export default class PegarVeiculosUseCase implements UseCase<IPaginationParams, IPaginationResponse<IVeiculo> | Error> {

  constructor(private readonly iVeiculoRepositorio: IVeiculoRepositorio) { }

  async execute(params: IPaginationParams): Promise<IPaginationResponse<IVeiculo> | Error> {
    try {
      const response = await this.iVeiculoRepositorio.pegarVeiculos(params);

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
              search: params.search ?? '',
            };
          }
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
