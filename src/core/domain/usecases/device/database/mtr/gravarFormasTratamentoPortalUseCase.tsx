import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IFormaTratamentoPortal } from '../../../../entities/portalMtr/portal';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarFormasTratamentoPortalParams {
  formasTratamento: IFormaTratamentoPortal[];
  userID: number;
}

export default class GravarFormasTratamentoPortalDeviceUseCase implements UseCase<IGravarFormasTratamentoPortalParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarFormasTratamentoPortalParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksFormasTratamento = splitArrayIntoChunksOfLen(params.formasTratamento, chunksLength);

      if (chunksFormasTratamento?.length > 0) {
        for await (const chunkFormaTratamento of chunksFormasTratamento) {
          let sqlParams: string = '';

          for await (const tratamento of chunkFormaTratamento) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${tratamento?.codigoFormaTratamento ?? 0},
                  ${tratamento?.codigoEstado ?? 0},
                  ${tratamento?.codigoFormaTratamentoSite ?? 0},
                  "${replaceString(tratamento?.descricaoFormaTratamentoSite ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirFormasTratamentoPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
