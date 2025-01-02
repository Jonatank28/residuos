import {
  ApiException, ILocation,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../../../repositories/device/localizacaoRepositorio';

export interface IGravarCheckOutClienteDeviceParams {
  clienteID: number;
  location: ILocation;
}

export default class GravarCheckOutClienteDeviceUseCase implements UseCase<IGravarCheckOutClienteDeviceParams, number | Error> {

  constructor(
    private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceLocationRepositorio: IDeviceLocalizacaoRepositorio
  ) { }

  async execute(params: IGravarCheckOutClienteDeviceParams): Promise<number | Error> {
    try {
      const insertLocationID = await this.iDeviceLocationRepositorio.inserirLocation(params.location);
      const rowsAffected = await this.iDeviceClienteRepositorio.fazerCheckOut(params.clienteID, insertLocationID);

      return rowsAffected;
    } catch (e) {
      return ApiException(e);
    }
  }
}