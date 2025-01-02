import { ApiException } from 'vision-common';
import { IMotivo } from '../../../entities/motivo';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';

export default class PegarMotivoUseCase implements UseCase<number | string, IMotivo | Error> {

  constructor(private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio) { }

  async execute(codigo: number | string): Promise<IMotivo | Error> {
    try {
      let motivo: IMotivo = {};
      const response = await this.iDeviceMotivoRepositorio.pegarMotivo(`@VRNOVACOLETA:${codigo}`);

      if (response && response?.codigo) {
        motivo = response;
      }

      return motivo;
    } catch (e) {
      return ApiException(e);
    }
  };
}
