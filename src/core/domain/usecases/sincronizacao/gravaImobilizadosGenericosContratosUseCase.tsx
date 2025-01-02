import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ApiException, splitArrayIntoChunksOfLen } from 'vision-common';
import { IMovimentacaoEtapaEquipamento } from '../../entities/movimentacaoEtapaEquipamento';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';
import { IImobilizadoGenericoContrato } from '../../entities/imobilizadoGenericoContrato';

export interface IGravarImobilizadosGenericosContratosUseCaseParametros {
  imobilizadosGenericosContratos: IImobilizadoGenericoContrato[];
  userID: number;
}

export default class GravarImobilizadosGenericosContratosUseCase
  implements UseCase<IGravarImobilizadosGenericosContratosUseCaseParametros, void | Error>
{
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(parametros: IGravarImobilizadosGenericosContratosUseCaseParametros): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunks = splitArrayIntoChunksOfLen(parametros.imobilizadosGenericosContratos, chunksLength);

      if (chunks?.length > 0) {
        for await (const chunk of chunks) {
          let sqlParams: string = '';

          for await (const movimentacao of chunk) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
              ${parametros.userID},
                ${movimentacao.codigoContrato},
                ${movimentacao.codigoImobilizadoGenerico}
              )`;
          }

          this.iDeviceResiduoRepositorio.inserirImobilizadosGenericosContratosSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
