import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export interface IGravarImobilizadosContratosUseCaseParams {
  imobilizados: IImobilizado[];
  userID: number;
}

export default class GravarImobilizadosContratosUseCase
  implements UseCase<IGravarImobilizadosContratosUseCaseParams, void | Error>
{
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(params: IGravarImobilizadosContratosUseCaseParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksImobilizadosContratos = splitArrayIntoChunksOfLen(params.imobilizados, chunksLength);

      if (chunksImobilizadosContratos?.length > 0) {
        for await (const chunkImobilizadosContratos of chunksImobilizadosContratos) {
          let sqlParams: string = '';

          for await (const imobilizadoContrato of chunkImobilizadosContratos) {
          sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                ${params.userID},
                ${imobilizadoContrato?.codigo ?? 0},
                ${imobilizadoContrato?.codigoContrato ?? 0},
                "${replaceString(imobilizadoContrato?.descricao ?? '')}",
                "${replaceString(imobilizadoContrato?.identificacao ?? '')}",
                ${imobilizadoContrato?.naoGerarMovimentacao ? 1 : 0},
                ${imobilizadoContrato?.xPesoEResiduoImobilizado ? 1 : 0},
                ${imobilizadoContrato?.codigoImobilizadoGenerico ?? 0},
                "${imobilizadoContrato?.tara ?? 0}",
                ${0},
                "${imobilizadoContrato?.cubagem ?? 0}"
              )`;
          }

          await this.iDeviceResiduoRepositorio.inserirImobilizadosContratosSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
