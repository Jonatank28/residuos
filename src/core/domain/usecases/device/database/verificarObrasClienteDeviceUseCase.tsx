import { IObra } from '../../../entities/obra';
import { ApiException, IPaginationParams } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';

export interface IVerificarObrasClienteDeviceUseCaseParams {
  clienteID: number;
  pagination: IPaginationParams;
}

export default class VerificarObrasClienteDeviceUseCase implements UseCase<IVerificarObrasClienteDeviceUseCaseParams, IObra | number | Error> {

  constructor(
    private readonly iClienteDeviceRepositorio: IDeviceClienteRepositorio,
    private readonly iEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio
  ) { }

  async execute(params: IVerificarObrasClienteDeviceUseCaseParams): Promise<IObra | number | Error> {
    try {
      const response = await this.iClienteDeviceRepositorio.pegarObrasClientePaginado(params);

      if (response.length === 1) {
        const _obra: IObra = response._array[0];

        if (_obra?.codigo) {
          const codigo = `@VROBRACLIENTE:${_obra.codigo}-${params.clienteID}`;

          const endereco = await this.iEnderecoDeviceRepositorio.pegarEndereco(codigo);

          if (endereco) {
            _obra.endereco = endereco;
          }

          return _obra;
        }
      }

      return response.length;
    } catch (e) {
      return ApiException(e);
    }
  };
}
