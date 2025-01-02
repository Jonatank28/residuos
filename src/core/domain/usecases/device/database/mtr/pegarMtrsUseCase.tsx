import { ApiException } from 'vision-common';
import { IMtr } from '../../../../entities/mtr';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';

export default class PegarMtrsUseCase implements UseCase<number | string, IMtr[] | Error> {

  constructor(private readonly iMtrRepositorio: IDeviceMtrRepositorio) { }

  async execute(codigoVinculo: number | string): Promise<IMtr[] | Error> {
    try {
      let mtrs: IMtr[] = [];
      const codigo = `@VRNOVACOLETA:${codigoVinculo}`;
      const response = await this.iMtrRepositorio.pegarMtrs(codigo);

      if (response.length > 0) {
        mtrs = response._array;

        for await (const mtr of mtrs) {
          if (!mtr.hasSinir && mtr?.codigoEstado) {
            const responseEstado = await this.iMtrRepositorio.pegarEstadoMtr(mtr.codigoEstado, codigo);

            if (responseEstado && responseEstado?.codigo) mtr.estado = responseEstado;
          }
        }
      }

      return mtrs;
    } catch (e) {
      return ApiException(e);
    }
  };
}
