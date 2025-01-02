import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ISubGrupoPortal } from '../../../../entities/portalMtr/portal';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarSubGruposPortalParams {
  subGruposPortal: ISubGrupoPortal[];
  userID: number;
}

export default class GravarSubGruposPortalDeviceUseCase implements UseCase<IGravarSubGruposPortalParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarSubGruposPortalParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksSubGruposPortal = splitArrayIntoChunksOfLen(params.subGruposPortal, chunksLength);

      if (chunksSubGruposPortal?.length > 0) {
        for await (const subGruposPortal of chunksSubGruposPortal) {
          let sqlParams: string = '';

          for await (const subGrupo of subGruposPortal) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${subGrupo?.codigoSubGrupo ?? 0},
                  ${subGrupo?.codigoEstado ?? 0},
                  ${subGrupo?.codigoClasseSite ?? 0},
                  "${replaceString(subGrupo?.descricaoClasseSite ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirSubGrupoPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
