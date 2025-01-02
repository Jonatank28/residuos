import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { setEndereco } from '../../../entities/endereco';
import { IFiltro } from '../../../entities/filtro';
import { IOrder } from '../../../entities/order';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';

export interface PegarColetasAgendadasParams {
  filtros: IFiltro;
  placa: string;
  cidade: string;
  pagination: IPaginationParams;
}

export default class PegarColetasAgendadasUseCase implements UseCase<PegarColetasAgendadasParams, IPaginationResponse<IOrder> | Error> {

  constructor(
    private readonly iOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio
  ) { }

  async execute(params: PegarColetasAgendadasParams): Promise<IPaginationResponse<IOrder> | Error> {
    try {
      let totalPaginas = 0;
      const coletasList: IOrder[] = [];

      const totalLinhas = await this.iOrdemServicoRepositorio.pegarTotalLinhasColetasAgendadas(params);
      const response = await this.iOrdemServicoRepositorio.pegarColetasAgendadas(params);

      if (response.length > 0) {
        if (totalLinhas > 0) {
          totalPaginas = Math.ceil(totalLinhas / params.pagination.amount);

          if (response.length > 0) {
            for await (const order of response._array) {
              const codigo = `@VRCOLETAAGENDADA:${order.codigoOS}`;
              const endereco = await this.iEnderecoRepositorio.pegarEndereco(codigo);

              if (endereco) {
                order.enderecoOS = setEndereco(endereco);
              }

              coletasList.push(order);
            }
          }
        }
      }

      return {
        ...params.pagination,
        items: response._array ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0
      };
    } catch (e) {
      return ApiException(e);
    }
  };
}
