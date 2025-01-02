import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDadosTransportador } from '../../../../entities/portalMtr/dadosTransportador';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarDadosTransportadorParams {
  dadosTransportador: IDadosTransportador[];
  userID: number;
}

export default class GravarDadosTransportadorMtrDeviceUseCase implements UseCase<IGravarDadosTransportadorParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarDadosTransportadorParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksDadosTransportador = splitArrayIntoChunksOfLen(params.dadosTransportador, chunksLength);

      if (chunksDadosTransportador?.length > 0) {
        for await (const chunkTransportador of chunksDadosTransportador) {
          let sqlParams: string = '';

          for await (const transportador of chunkTransportador) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  "${replaceString(transportador?.razaoSocial ?? '')}",
                  "${replaceString(transportador?.cpfcnpj ?? '')}",
                  "${replaceString(transportador?.numero ?? '')}",
                  "${replaceString(transportador?.bairro ?? '')}",
                  "${replaceString(transportador?.rua ?? '')}",
                  "${replaceString(transportador?.cidade ?? '')}",
                  "${replaceString(transportador?.uf ?? '')}",
                  "${replaceString(transportador?.telefone ?? '')}",
                  "${replaceString(transportador?.celular ?? '')}",
                  "${replaceString(transportador?.motorista ?? '')}",
                  "${replaceString(transportador?.cargoMotorista ?? '')}",
                  ${transportador?.codigoTransportador ?? 0}
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirDadosTransportadorPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
