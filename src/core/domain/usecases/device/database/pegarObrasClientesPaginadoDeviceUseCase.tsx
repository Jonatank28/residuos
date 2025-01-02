import { IObra } from '../../../entities/obra';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';

export interface IPegarObrasClientesPaginadoDeviceParams {
  pagination: IPaginationParams;
  clienteID: number;
  placa: string;
}

export default class PegarObrasClientesPaginadoDeviceUseCase implements UseCase<IPegarObrasClientesPaginadoDeviceParams, IPaginationResponse<IObra> | Error> {

  constructor(private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio) { }

  async execute(params: IPegarObrasClientesPaginadoDeviceParams): Promise<IPaginationResponse<IObra> | Error> {
    try {
      let totalPaginas = 0;

      const totalLinhas = await this.iDeviceClienteRepositorio.pegarTotalLinhasObras();

      const response = params.placa?.length > 0
        ? await this.iDeviceClienteRepositorio.pegarObrasColetasAgendadasPaginado(params)
        : await this.iDeviceClienteRepositorio.pegarObrasHistoricoColetasPaginado(params);

      if (response.length > 0 && totalLinhas > 0) {
        totalPaginas = Math.ceil(totalLinhas / params.pagination.amount);
      }

      return {
        ...params.pagination,
        items: response._array ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0,
      };
    } catch (e) {
      return ApiException(e);
    }
  };
}
