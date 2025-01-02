import { ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IObra, setObra } from '../entities/obra';
import BadRequestException from '../exceptions/badRequestException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export interface IPegarObrasClientePaginadoUseCaseParams {
  clienteID: number;
  pagination: IPaginationParams;
}

export default class PegarObrasClientePaginadoUseCase implements UseCase<IPegarObrasClientePaginadoUseCaseParams, IPaginationResponse<IObra> | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) { }

  async execute(params: IPegarObrasClientePaginadoUseCaseParams): Promise<IPaginationResponse<IObra> | Error> {
    try {
      const response = await this.iClienteRepositorio.pegarObrasClientePaginado(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const {
              data, totalPaginas, pagina, total, linhas,
            } = response.data;
            const obrasList: IObra[] = [];

            for await (const cliente of data) {
              obrasList.push(setObra(cliente));
            }

            return {
              items: obrasList ?? [],
              pages: totalPaginas ?? 0,
              page: pagina ?? 0,
              length: total ?? 0,
              amount: linhas ?? 0,
              search: params.pagination.search ?? '',
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
