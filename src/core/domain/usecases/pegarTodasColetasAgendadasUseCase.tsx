import {
  ApiException, ApiUnknownException, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder, setOrder } from '../entities/order';
import BadRequestException from '../exceptions/badRequestException';
import { IDeviceOrdemServicoRepositorio } from '../repositories/device/ordemServicoRepositorio';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';

export default class PegarTodasColetasAgendadasUseCase implements UseCase<void, IOrder[] | Error> {

  constructor(
    private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio,
    private readonly iOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio
  ) { }

  async execute(): Promise<IOrder[] | Error> {
    try {
      const response = await this.iOrdemServicoRepositorio.pegarTodasColetasAgendadas();

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const coletasData = response.data;
            const ordersList: IOrder[] = [];
            const responsePendente = await this.iOrdemServicoDeviceRepositorio.pegarColetasAgendadasPendente();

            for await (const order of coletasData) {
              if (responsePendente.length > 0) {
                const foundColeta = responsePendente._array.filter((coletaOff) => coletaOff.codigoOS === order.codigoOS);

                if (foundColeta.length === 0) {
                  ordersList.push(setOrder(order));
                }
              } else {
                ordersList.push(setOrder(order));
              }
            }

            return ordersList;
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
