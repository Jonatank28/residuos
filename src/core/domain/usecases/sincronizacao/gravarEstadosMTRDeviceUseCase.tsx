import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEstado } from '../../entities/estado';
import { IDeviceMtrRepositorio } from '../../repositories/device/mtrRepositorio';

export interface IGravarEstadosMTRParams {
  estados: IEstado[];
  userID: number;
}

export default class GravarEstadosMTRDeviceUseCase implements UseCase<IGravarEstadosMTRParams, void | Error> {

  constructor(private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio) { }

  async execute(params: IGravarEstadosMTRParams): Promise<void | Error> {
    try {
      let sqlEstadosMtrsParams: string = '';

      for await (const estado of params.estados) {
        sqlEstadosMtrsParams += `${sqlEstadosMtrsParams.length > 0 ? ',' : ''}(
            ${estado.codigo},
            ${params.userID},
            "CONTROLLER",
            "${replaceString(estado?.descricao ?? '')}",
            ${estado?.habilitarIntegracaoEstadual ? 1 : 0},
            ${estado?.possuiIntegracaoEstadual ? 1 : 0}
          )`;
      }

      this.iDeviceMtrRepositorio.inserirEstadoMtrSincronizacao(sqlEstadosMtrsParams);
    } catch (e) {
      return ApiException(e);
    }
  };
}
