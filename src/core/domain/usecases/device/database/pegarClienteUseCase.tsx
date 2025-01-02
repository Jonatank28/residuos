import { ApiException } from 'vision-common';
import { ICliente } from '../../../entities/cliente';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class PegarClienteDeviceUseCase implements UseCase<number, ICliente | Error> {

  constructor(
    private readonly iClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iResiduoRepositorio: IDeviceResiduoRepositorio
  ) { }

  async execute(clienteID: number): Promise<ICliente | Error> {
    try {
      let cliente: ICliente = {};
      const response = await this.iClienteRepositorio.pegarCliente(clienteID);

      if (response && response?.codigo) {
        const endereco = await this.iEnderecoRepositorio.pegarEndereco(response.codigo);
        const containers = await this.iResiduoRepositorio.pegarContainers(response.codigo);

        if (endereco) {
          response.endereco = endereco;
        }

        if (containers.length > 0) {
          response.containers = containers._array;
        }

        cliente = response;
      }

      return cliente;
    } catch (e) {
      return ApiException(e);
    }
  };
}
