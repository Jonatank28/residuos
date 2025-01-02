import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IFormaAcondicionamentoPortal } from '../../../../entities/portalMtr/portal';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarFormasAcondicionamentoParams {
  formasAcondicionamento: IFormaAcondicionamentoPortal[];
  userID: number;
}

export default class GravarFormasAcondicionamentoPortalDeviceUseCase implements UseCase<IGravarFormasAcondicionamentoParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarFormasAcondicionamentoParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksFormasAcondicionamento = splitArrayIntoChunksOfLen(params.formasAcondicionamento, chunksLength);

      if (chunksFormasAcondicionamento?.length > 0) {
        for await (const chunkFormaAcondicionamento of chunksFormasAcondicionamento) {
          let sqlParams: string = '';

          for await (const acondicionamento of chunkFormaAcondicionamento) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${acondicionamento?.codigoAcondicionamentoMTR ?? 0},
                  ${acondicionamento?.codigoEstado ?? 0},
                  ${acondicionamento?.codigoAcondicionamentoSite ?? 0},
                  "${replaceString(acondicionamento?.descricaoAcondicionamentoSite ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirAcondicionamentoPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
