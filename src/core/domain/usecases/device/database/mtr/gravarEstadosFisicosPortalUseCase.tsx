import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEstadoFisicoPortal } from '../../../../entities/portalMtr/portal';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarEstadosFisicosParams {
  estadosFisicos: IEstadoFisicoPortal[];
  userID: number;
}

export default class GravarEstadosFisicosPortalDeviceUseCase implements UseCase<IGravarEstadosFisicosParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarEstadosFisicosParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksEstadosFisicos = splitArrayIntoChunksOfLen(params.estadosFisicos, chunksLength);

      if (chunksEstadosFisicos?.length > 0) {
        for await (const chunkEstadosFisico of chunksEstadosFisicos) {
          let sqlParams: string = '';

          for await (const estadoFisico of chunkEstadosFisico) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${estadoFisico?.codigoEstadoFisico ?? 0},
                  ${estadoFisico?.codigoEstado ?? 0},
                  ${estadoFisico?.codigoEstadoFisicoSite ?? 0},
                  "${replaceString(estadoFisico?.descricaoEstadoFisicoSite ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirEstadosFisicosPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
