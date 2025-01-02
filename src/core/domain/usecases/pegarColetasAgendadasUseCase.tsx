import {
  ApiException, ApiUnknownException, IPaginationParams, IPaginationResponse, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IFiltro } from '../entities/filtro';
import { IOrder, setOrder } from '../entities/order';
import BadRequestException from '../exceptions/badRequestException';
import { IDeviceOrdemServicoRepositorio } from '../repositories/device/ordemServicoRepositorio';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';

export interface IPegarColetasAgendadasParams {
  placa: string;
  cidade: string;
  filtros: IFiltro;
  pagination: IPaginationParams;
}

export default class PegarColetasAgendadasUseCase implements UseCase<IPegarColetasAgendadasParams, IPaginationResponse<IOrder> | Error> {

  constructor(
    private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio,
    private readonly iOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio
  ) { }

  async execute(params: IPegarColetasAgendadasParams): Promise<IPaginationResponse<IOrder> | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.pegarColetasAgendadas(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const { data, totalPaginas, pagina, total, linhas } = response.data;

            const responsePendente = await this.iOrdemServicoDeviceRepositorio.pegarColetasAgendadasPendente();

            const ordersList: IOrder[] = [];

            for (const order of data) {
              if (responsePendente.length > 0) {
                const foundColeta = responsePendente._array.filter((coletaOff) => coletaOff.codigoOS === order.codigoOS);

                if (foundColeta.length === 0) {
                  ordersList.push(setOrder(order));
                }
              } else {
                ordersList.push(setOrder(order));
              }
            }

            return {
              items: ordersList ?? [],
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
