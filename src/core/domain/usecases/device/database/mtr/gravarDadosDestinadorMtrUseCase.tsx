import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDadosDestinador } from '../../../../entities/portalMtr/dadosDestinador';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarDadosDestinadorMtrParams {
  dadosDestinadores: IDadosDestinador[];
  userID: number;
}

export default class GravarDadosDestinadorMtrDeviceUseCase implements UseCase<IGravarDadosDestinadorMtrParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarDadosDestinadorMtrParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksDadosDestinadores = splitArrayIntoChunksOfLen(params.dadosDestinadores, chunksLength);

      if (chunksDadosDestinadores?.length > 0) {
        for await (const chunkDestinador of chunksDadosDestinadores) {
          let sqlParams: string = '';

          for await (const destinador of chunkDestinador) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${destinador?.codigoDestinador ?? 0},
                  "${replaceString(destinador?.nomeDestinador ?? '')}",
                  "${replaceString(destinador?.cpfcnpj ?? '')}",
                  "${replaceString(destinador?.rua ?? '')}",
                  "${replaceString(destinador?.bairro ?? '')}",
                  ${destinador?.numero ?? 0},
                  "${replaceString(destinador?.municipio ?? '')}",
                  "${replaceString(destinador?.estado ?? '')}",
                  "${replaceString(destinador?.telefone ?? '')}",
                  "${replaceString(destinador?.celular ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirDadosDestinadorPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
