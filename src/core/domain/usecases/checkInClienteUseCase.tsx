import { ApiException, ApiUnknownException, ILocation, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import BadRequestException from '../exceptions/badRequestException';
import NotAcceptableException from '../exceptions/notAcceptableException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';
import { IDeviceClienteRepositorio } from '../repositories/device/clienteRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../repositories/device/localizacaoRepositorio';

export interface IChelInClienteParams {
  location: ILocation;
  clienteID: number;
  codigoOs?: number;
}

export default class CheckInClienteUseCase implements UseCase<IChelInClienteParams, void | Error> {
  constructor(
    private readonly iClienteRepositorio: IClienteRepositorio,
    private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceLocationRepositorio: IDeviceLocalizacaoRepositorio,
  ) {}

  async execute(params: IChelInClienteParams): Promise<void | Error> {
    try {
      const response = await this.iClienteRepositorio.checkIn(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK: {
          const xOnline = true;
          const locationID = await this.iDeviceLocationRepositorio.inserirLocation(params.location);
          await this.iDeviceClienteRepositorio.inserirCheckIn(
            {
              ...params,
              xSincronizado: true,
              xOnline,
            },
            locationID,
          );

          break;
        }
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.NOT_ACCEPTABLE:
          return NotAcceptableException();
        case statusCode.FORBIDDEN: {
          if (response?.data?.message) {
            const xOnline = true;
            const locationID = await this.iDeviceLocationRepositorio.inserirLocation(params.location);
            await this.iDeviceClienteRepositorio.inserirCheckIn(
              {
                ...params,
                xSincronizado: true,
                clienteID: response.data['message'],
                xOnline,
              },
              locationID,
            );

            break;
          } else {
            return BadRequestException();
          }
        }
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
