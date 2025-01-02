import { ApiException } from 'vision-common';
import { IMotivo } from '../../../entities/motivo';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';

export default class PegarMotivosUseCase implements UseCase<void, IMotivo[] | Error> {

  constructor(private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio) { }

  async execute(): Promise<IMotivo[] | Error> {
    try {
      let motivos: IMotivo[] = [];
      const response = await this.iDeviceMotivoRepositorio.pegarMotivos();

      if (response.length > 0) {
        motivos = response._array;
      }

      return motivos;
    } catch (e) {
      return ApiException(e);
    }
  };
}
