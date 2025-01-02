import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IConfiguracaoDestinador } from '../../../../entities/portalMtr/dadosDestinador';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarConfiguracoesDestinadorParams {
  configuracoes: IConfiguracaoDestinador[];
  userID: number;
}

export default class GravarConfiguracoesDestinadorMtrDeviceUseCase implements UseCase<IGravarConfiguracoesDestinadorParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarConfiguracoesDestinadorParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksConfiguracaoDestinador = splitArrayIntoChunksOfLen(params.configuracoes, chunksLength);

      if (chunksConfiguracaoDestinador?.length > 0) {
        for await (const chunkDestinador of chunksConfiguracaoDestinador) {
          let sqlParams: string = '';

          for await (const configuracaoDestinador of chunkDestinador) {
            sqlParams += `${sqlParams?.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${configuracaoDestinador?.codigoDestinador ?? 0},
                  ${configuracaoDestinador?.codigoEstado ?? 0},
                  ${configuracaoDestinador?.codigoUnidade ?? 0},
                  "${replaceString(configuracaoDestinador?.responsavelRecebimento ?? '')}",
                  "${replaceString(configuracaoDestinador?.cargoResponsavelRecebimento ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirConfiguracoesDestinadorSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
