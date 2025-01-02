import I18n from 'i18n-js';
import { ApiException, ApiUnknownException, ILocation, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import BadRequestException from '../exceptions/badRequestException';
import NotAcceptableException from '../exceptions/notAcceptableException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../repositories/device/localizacaoRepositorio';
import { IDeviceClienteRepositorio } from '../repositories/device/clienteRepositorio';

export interface ICheckOutClienteParams {
  location: ILocation;
  clienteID: number;
}

export default class CheckOutClienteUseCase implements UseCase<ICheckOutClienteParams, void | Error> {
  constructor(
    private readonly iClienteRepositorio: IClienteRepositorio,
    private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceLocationRepositorio: IDeviceLocalizacaoRepositorio,
  ) {}

  async execute(params: ICheckOutClienteParams): Promise<void | Error> {
    try {
      const response = await this.iClienteRepositorio.checkOut(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK: {
          const locationID = await this.iDeviceLocationRepositorio.inserirLocation(params.location);
          await this.iDeviceClienteRepositorio.fazerCheckOut(params.clienteID, locationID);

          break;
        }
        case statusCode.BAD_REQUEST:
          return BadRequestException(I18n.t('exceptions.customs.checkOut'));
        case statusCode.NOT_ACCEPTABLE:
          return NotAcceptableException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
