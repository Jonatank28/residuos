import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ICliente, setCliente } from '../entities/cliente';
import { IRegiao } from '../entities/regiao';
import BadRequestException from '../exceptions/badRequestException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export interface IPegarClientesParams {
  pagination: IPaginationParams;
  regioes: IRegiao[];
}

export default class PegarClientesUseCase implements UseCase<IPegarClientesParams, IPaginationResponse<ICliente> | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) { }

  async execute(params: IPegarClientesParams): Promise<IPaginationResponse<ICliente> | Error> {
    try {
      let newRegioes: string = '';

      if (params.regioes?.length > 0) {
        params.regioes.forEach((regiao: IRegiao) => { newRegioes += (`&codigoRegiao=${regiao.codigo}`); });
      }

      const response = await this.iClienteRepositorio.pegarClientes(params.pagination, newRegioes);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const {
              data, totalPaginas, pagina, total, linhas,
            } = response.data;
            const clientesList: ICliente[] = [];

            for await (const cliente of data) {
              clientesList.push(setCliente(cliente));
            }

            return {
              items: clientesList ?? [],
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
