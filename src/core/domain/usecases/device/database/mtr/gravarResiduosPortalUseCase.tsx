import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IResiduoPortal } from '../../../../entities/portalMtr/portal';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarResiduosPortalParams {
  residuosPortal: IResiduoPortal[];
  userID: number;
}

export default class GravarResiduosPortalDeviceUseCase implements UseCase<IGravarResiduosPortalParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarResiduosPortalParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksResiduosPortal = splitArrayIntoChunksOfLen(params.residuosPortal, chunksLength);

      if (chunksResiduosPortal?.length > 0) {
        for await (const residuosPortal of chunksResiduosPortal) {
          let sqlParams: string = '';

          for await (const residuo of residuosPortal) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                ${params.userID},
                ${residuo?.codigoEstado ?? 0},
                "${replaceString(residuo?.codigoResiduoSite ?? '')}",
                "${replaceString(residuo?.descricaoResiduoSite ?? '')}",
                ${residuo?.codigoMaterial ?? 0}
              )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirResiduosPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
