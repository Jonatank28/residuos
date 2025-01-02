import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IMtr } from '../../../../entities/mtr';
import { IOrder } from '../../../../entities/order';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';

export interface IAtualizarMtrDeviceParams {
  mtrs: IMtr[];
  coleta: IOrder;
}

export default class AtualizarMtrDeviceUseCase implements UseCase<IAtualizarMtrDeviceParams, void | Error> {

  constructor(private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio) { }

  async execute(params: IAtualizarMtrDeviceParams): Promise<void | Error> {
    try {
      await this.iDeviceMtrRepositorio.deletarMtr(params.coleta?.codigoVinculo ?? '');
      await this.iDeviceMtrRepositorio.deletarEstadosMtr(params.coleta?.codigoVinculo ?? '');

      if (params.mtrs && params.mtrs.length > 0) {
        for await (const mtr of params.mtrs) {
          await this.iDeviceMtrRepositorio.inserirMtr(mtr, params.coleta?.codigoVinculo ?? '');

          if (!mtr.hasSinir && mtr.estado && mtr.estado.codigo) {
            await this.iDeviceMtrRepositorio.inserirEstadoMtr(mtr.estado, params.coleta?.codigoVinculo ?? '');
          }
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
