import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IObra } from '../entities/obra';
import BadRequestException from '../exceptions/badRequestException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export interface IPegarObrasClientesParams {
  pagination: IPaginationParams;
  clienteID: number;
  placa: string;
}

export default class PegarObrasClientesPaginadoUseCase implements UseCase<IPegarObrasClientesParams, IPaginationResponse<IObra> | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) { }

  async execute(params: IPegarObrasClientesParams): Promise<IPaginationResponse<IObra> | Error> {
    try {
      const response = await this.iClienteRepositorio.pegarObrasClientePorPlacaPaginado(params);

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
