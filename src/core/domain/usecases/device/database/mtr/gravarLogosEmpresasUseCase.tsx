import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ILogoEmpresa } from '../../../../entities/portalMtr/logoEmpresa';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGravarLogosEmpresasParams {
  logosEmpresas: ILogoEmpresa[];
  userID: number;
}

export default class GravarLogosEmpresasDeviceUseCase implements UseCase<IGravarLogosEmpresasParams, void | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGravarLogosEmpresasParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksLogosEmpresas = splitArrayIntoChunksOfLen(params.logosEmpresas, chunksLength);

      if (chunksLogosEmpresas?.length > 0) {
        for await (const chunkLogosEmpresas of chunksLogosEmpresas) {
          let sqlParams: string = '';

          for await (const logo of chunkLogosEmpresas) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${logo?.codigoEmpresa ?? 0},
                  "${replaceString(logo?.base64Logo ?? '')}"
                )`;
          }

          await this.iDeviceMtrPortalRepositorio.inserirLogosEmpresasPortalSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
