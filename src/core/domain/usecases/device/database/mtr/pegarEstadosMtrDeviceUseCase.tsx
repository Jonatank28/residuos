import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEstado } from '../../../../entities/estado';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';

export default class PegarEstadosMtrDeviceUseCase implements UseCase<void, IEstado[] | Error> {

  constructor(private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio) { }

  async execute(): Promise<IEstado[] | Error> {
    try {
      const response = await this.iDeviceMtrRepositorio.pegarEstadosMtr();

      if (response.length > 0)
        return response._array;

      return [];
    } catch (e) {
      return ApiException(e);
    }
  };
}
