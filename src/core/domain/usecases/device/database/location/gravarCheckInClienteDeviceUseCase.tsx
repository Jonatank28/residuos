import { ApiException, ILocation } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../../../repositories/device/localizacaoRepositorio';

export interface IGravarCheckInClienteParams {
  clienteID: number;
  location: ILocation;
  xOnline: boolean;
  codigoOs?: number;
  xSincronizado?: boolean;
}

export default class GravarCheckInClienteDeviceUseCase implements UseCase<IGravarCheckInClienteParams, number | Error> {

  constructor(
    private readonly iDeviceClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iDeviceLocationRepositorio: IDeviceLocalizacaoRepositorio
  ) { }

  async execute(params: IGravarCheckInClienteParams): Promise<number | Error> {
    try {
      const insertLocationID = await this.iDeviceLocationRepositorio.inserirLocation(params.location);
      const insertID = await this.iDeviceClienteRepositorio.inserirCheckIn(params, insertLocationID);

      return insertID;
    } catch (e) {
      return ApiException(e);
    }
  }
}