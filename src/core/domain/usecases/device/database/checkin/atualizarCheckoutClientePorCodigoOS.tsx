import { ApiException, ILocation } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../../../repositories/device/localizacaoRepositorio';
import BadRequestException from 'vision-common/src/core/domain/exceptions/badRequestException';

export interface AtualizarCheckoutClientePorCodigoOSDeviceUseCaseParametros {
  codigoOS: number;
  dataCheckout: Date;
  localizacao: ILocation;
}

export default class AtualizarCheckoutClientePorCodigoOSDeviceUseCase
  implements UseCase<AtualizarCheckoutClientePorCodigoOSDeviceUseCaseParametros, number | Error>
{
  constructor(
    private readonly iClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceLocationRepositorio: IDeviceLocalizacaoRepositorio,
  ) {}

  async execute(parametros: AtualizarCheckoutClientePorCodigoOSDeviceUseCaseParametros): Promise<number | Error> {
    try {
      if (!parametros.localizacao?.latitude || !parametros.localizacao?.longitude)
        return BadRequestException('Localização inválida');

      if (!parametros.codigoOS) return BadRequestException('Código da ordem de serviço inválido');

      if (!parametros.dataCheckout) return BadRequestException('Data de checkout inválida');

      const insertLocationID = await this.iDeviceLocationRepositorio.inserirLocation(parametros.localizacao);

      const response = await this.iClienteRepositorio.atualizarCheckoutClientePorCodigoOSDevice(
        parametros.codigoOS,
        parametros.dataCheckout,
        insertLocationID,
      );

      return response;
    } catch (e) {
      return ApiException(e);
    }
  }
}
