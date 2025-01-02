import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDadosGerador } from '../../../../entities/portalMtr/dadosGerador';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarDadosGeradorParams {
  dadosGerador: IDadosGerador[];
  userID: number;
}

export default class GravarDadosGeradorMtrDeviceUseCase implements UseCase<IGravarDadosGeradorParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarDadosGeradorParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksDadosGeradorMtr = splitArrayIntoChunksOfLen(params.dadosGerador, chunksLength);

      if (chunksDadosGeradorMtr?.length > 0) {
        for await (const chunkGerador of chunksDadosGeradorMtr) {
          let sqlParams: string = '';

          for await (const gerador of chunkGerador) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${gerador?.codigo ?? 0},
                  ${gerador?.codigoEstado ?? 0},
                  ${gerador?.codigoUnidade ?? 0},
                  "${replaceString(gerador?.cpfcnpj ?? '')}",
                  ${gerador?.codigoObra ?? 0}
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirGeradorPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
