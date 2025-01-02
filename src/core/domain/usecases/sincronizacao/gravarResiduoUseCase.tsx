import { IResiduo } from '../../entities/residuo';
import { ApiException, removerQuebrasLinha, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';

export interface IGravarResiduoParams {
  residuos: IResiduo[];
  userID: number;
}

export default class GravarResiduoUseCase implements UseCase<IGravarResiduoParams, void | Error> {

  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(params: IGravarResiduoParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksResiduos = splitArrayIntoChunksOfLen(params.residuos, chunksLength);

      let index = 0;

      if (chunksResiduos?.length > 0) {
        for await (const chunkResiduos of chunksResiduos) {

          if (index > 5) return;
          let sqlParams: string = '';

          for await (const residuo of chunkResiduos) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                ${params.userID},
                ${residuo?.codigo ?? 0},
                ${residuo?.codigoIDResiduo ?? 0},
                ${residuo?.xExigeInteiro ? 1 : 0},
                ${null},
                "${replaceString(residuo?.descricao ?? '')}",
                "${replaceString(residuo?.cor ?? '')}",
                "${replaceString(residuo?.unidade ?? '')}",
                ${residuo?.quantidade ?? 0},
                "${replaceString(residuo?.subGrupo ?? '')}",
                "${removerQuebrasLinha(replaceString(residuo?.observacao ?? ''))}",
                ${residuo?.naoConforme ? 1 : 0},
                ${residuo?.excesso ? 1 : 0},
                "${replaceString(residuo?.codigoIbama ?? '')}",
                ${residuo?.codigoEstadoFisico ?? null},
                ${residuo?.codigoSubGrupo ?? null},
                ${residuo?.codigoAcondicionamento ?? null},
                ${residuo?.codigoUnidade ?? null},
                ${residuo?.codigoFormaTratamento ?? null},
                "${replaceString(residuo?.codigoHashResiduo ?? '')}",
                ${residuo?.preCadastroReferencia ? 1 : 0},
                ${residuo?.valorUnitario ?? 0},
                "${residuo?.tara ?? 0}",
                "${residuo?.pesoBruto ?? 0}",
                "${residuo?.cubagem ?? 0}",
                ${residuo?.xImobilizadoGenerico ? 1 : 0},
                ${residuo?.xColetarSomenteComEquipamento ? 1 : 0}
              )`;
          }

          await this.iResiduoRepositorio.inserirResiduoSincronizacao(sqlParams)
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
