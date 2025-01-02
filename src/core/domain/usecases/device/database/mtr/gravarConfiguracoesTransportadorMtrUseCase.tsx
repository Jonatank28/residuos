import { ApiException, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IConfiguracaoTransportador } from '../../../../entities/portalMtr/dadosTransportador';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarConfiguracoesTransportadorParams {
  configuracoes: IConfiguracaoTransportador[];
  userID: number;
}

export default class GravarConfiguracoesTransportadorMtrDeviceUseCase implements UseCase<IGravarConfiguracoesTransportadorParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarConfiguracoesTransportadorParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksConfiguracaoTransportador = splitArrayIntoChunksOfLen(params.configuracoes, chunksLength);

      if (chunksConfiguracaoTransportador?.length > 0) {
        for await (const chunkTransportador of chunksConfiguracaoTransportador) {
          let sqlParams: string = '';

          for await (const configuracaoTransportador of chunkTransportador) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${configuracaoTransportador?.codigo ?? 0},
                  ${configuracaoTransportador?.codigoEstado ?? 0},
                  ${configuracaoTransportador?.codigoUnidade ?? 0}
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirConfiguracoesTransportadorSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
