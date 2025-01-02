import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IUnidadePortal } from '../../../../entities/portalMtr/portal';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarUnidadesPortalParams {
  unidadesPortal: IUnidadePortal[];
  userID: number;
}

export default class GravarUnidadesPortalDeviceUseCase implements UseCase<IGravarUnidadesPortalParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarUnidadesPortalParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksUnidadesPortal = splitArrayIntoChunksOfLen(params.unidadesPortal, chunksLength);

      if (chunksUnidadesPortal?.length > 0) {
        for await (const unidadesPortal of chunksUnidadesPortal) {
          let sqlParams: string = '';

          for await (const unidade of unidadesPortal) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${unidade?.codigoUnidade ?? 0},
                  ${unidade?.codigoUnidadeSite ?? 0},
                  "${replaceString(unidade?.descricaoUnidadeSite ?? '')}",
                  ${unidade?.codigoEstado ?? 0}
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirUnidadePortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
