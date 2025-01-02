import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ApiException, splitArrayIntoChunksOfLen } from 'vision-common';
import { IMovimentacaoEtapaEquipamento } from '../../entities/movimentacaoEtapaEquipamento';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';

export interface IGravarMovimentacaoEquipamentosPendentesLiberacaoParametros {
  equipamentosPendentes: IMovimentacaoEtapaEquipamento[];
  userID: number;
}

export default class GravarMovimentacaoEquipamentosPendentesLiberacaoUseCase
  implements UseCase<IGravarMovimentacaoEquipamentosPendentesLiberacaoParametros, void | Error>
{
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(parametros: IGravarMovimentacaoEquipamentosPendentesLiberacaoParametros): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunks = splitArrayIntoChunksOfLen(parametros.equipamentosPendentes, chunksLength);

      if (chunks?.length > 0) {
        for await (const chunk of chunks) {
          let sqlParams: string = '';

          for await (const movimentacao of chunk) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
              ${parametros.userID},
                ${movimentacao.codigoMaterial},
                ${movimentacao.etapa},
                ${movimentacao?.codigoOS ?? null},
                ${movimentacao.xLiberado ? 1 : 0}
              )`;
          }

          this.iDeviceResiduoRepositorio.inserirEquipamentosPendentesLiberacaoSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
