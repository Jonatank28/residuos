import { ApiException } from 'vision-common';
import { IMotivo } from '../../../entities/motivo';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';

export default class GravarMotivosUseCase implements UseCase<IMotivo[], void | Error> {

  constructor(private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio) { }

  async execute(motivos: IMotivo[]): Promise<void | Error> {
    try {
      for await (const motivo of motivos) {
        await this.iDeviceMotivoRepositorio.inserirMotivo(motivo, null);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
