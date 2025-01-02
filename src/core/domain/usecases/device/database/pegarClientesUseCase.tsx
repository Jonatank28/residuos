import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ICliente } from '../../../entities/cliente';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class PegarClientesDeviceUseCase implements UseCase<IPaginationParams, IPaginationResponse<ICliente> | Error> {

  constructor(
    private readonly iClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iResiduoRepositorio: IDeviceResiduoRepositorio
  ) { }

  async execute(params: IPaginationParams): Promise<IPaginationResponse<ICliente> | Error> {
    try {
      let totalPaginas = 0;
      const clientesList: ICliente[] = [];

      const totalLinhas = await this.iClienteRepositorio.pegarTotalLinhasClientes();
      const response = await this.iClienteRepositorio.pegarClientes(params);

      if (response.length > 0) {
        if (totalLinhas > 0) {
          totalPaginas = Math.ceil(totalLinhas / params.amount);

          for await (const cliente of response._array) {
            if (cliente.codigo) {
              const enderecoResponse = await this.iEnderecoRepositorio.pegarEndereco(cliente.codigo);
              const containersResponse = await this.iResiduoRepositorio.pegarContainers(cliente.codigo);

              if (enderecoResponse) {
                cliente.endereco = enderecoResponse;
              }

              if (containersResponse.length > 0) {
                cliente.containers = containersResponse._array;
              }

              clientesList.push(cliente);
            }
          }
        }
      }

      return {
        ...params,
        items: clientesList ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0
      };
    } catch (e) {
      return ApiException(e);
    }
  };
}
