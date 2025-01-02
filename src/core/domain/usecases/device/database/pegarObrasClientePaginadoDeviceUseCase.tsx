import { IObra } from '../../../entities/obra';
import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';

export interface IPegarObrasClientePaginadoDeviceUseCaseParams {
  clienteID: number;
  pagination: IPaginationParams;
}

export default class PegarObrasClientePaginadoDeviceUseCase implements UseCase<IPegarObrasClientePaginadoDeviceUseCaseParams, IPaginationResponse<IObra> | Error> {
  constructor(
    private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio,
    private readonly iEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio
  ) { }

  async execute(params: IPegarObrasClientePaginadoDeviceUseCaseParams): Promise<IPaginationResponse<IObra> | Error> {
    try {
      let totalPaginas = 0;
      const obrasList: IObra[] = [];

      const totalLinhas = await this.iClienteDeviceRepositorio.pegarTotalLinhasObras();
      const response = await this.iClienteDeviceRepositorio.pegarObrasClientePaginado(params);

      if (response.length > 0) {
        if (totalLinhas > 0) {
          totalPaginas = Math.ceil(totalLinhas / params.pagination.amount);

          for await (const obra of response._array) {
            if (obra?.codigo) {
              const codigo = `@VROBRACLIENTE:${obra.codigo}-${params.clienteID}`;

              const endereco = await this.iEnderecoDeviceRepositorio.pegarEndereco(codigo);

              if (endereco) {
                obra.endereco = endereco;
              }

              obrasList.push(obra);
            }
          }
        }
      }

      return {
        ...params.pagination,
        items: obrasList ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0
      };
    } catch (e) {
      return ApiException(e);
    }
  };
}
