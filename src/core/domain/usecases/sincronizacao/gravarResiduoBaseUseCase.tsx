import { IResiduo } from '../../entities/residuo';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ApiException, removerQuebrasLinha, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';

export interface IGravarResiduosBaseParams {
  residuosBase: IResiduo[];
  userID: number;
}

export default class GravarResiduoBaseUseCase implements UseCase<IGravarResiduosBaseParams, void | Error> {

  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(params: IGravarResiduosBaseParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksResiduosBase = splitArrayIntoChunksOfLen(params.residuosBase, chunksLength);

      if (chunksResiduosBase?.length > 0) {
        for await (const chunkResiduosBase of chunksResiduosBase) {
          let sqlParams: string = '';

          for await (const residuoBase of chunkResiduosBase) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  ${residuoBase?.codigo ?? 0},
                  ${residuoBase?.xExigeInteiro ? 1 : 0},
                  ${residuoBase?.codigoContrato && residuoBase.codigoContrato !== 0 ? residuoBase.codigoContrato : null},
                  ${residuoBase?.codigoServico && residuoBase.codigoServico !== 0 ? residuoBase.codigoServico : null},
                  ${residuoBase?.codigoCliente && residuoBase.codigoCliente !== 0 ? residuoBase.codigoCliente : null},
                  "${replaceString(residuoBase?.descricao ?? '')}",
                  "${replaceString(residuoBase?.cor ?? '')}",
                  "${replaceString(residuoBase?.unidade ?? '')}",
                  ${residuoBase?.quantidade ?? 0},
                  "${replaceString(residuoBase?.subGrupo ?? '')}",
                  "${removerQuebrasLinha(replaceString(residuoBase?.observacao ?? ''))}",
                  ${residuoBase?.xResiduo ? 1 : 0},
                  ${residuoBase?.naoConforme ? 1 : 0},
                  ${residuoBase?.excesso ? 1 : 0},
                  "${replaceString(residuoBase?.codigoIbama ?? '')}",
                  ${residuoBase?.codigoEstadoFisico ?? null},
                  ${residuoBase?.codigoSubGrupo ?? null},
                  ${residuoBase?.codigoAcondicionamento ?? null},
                  ${residuoBase?.codigoUnidade ?? null},
                  ${residuoBase?.codigoFormaTratamento ?? null},
                  ${residuoBase?.valorUnitario ?? 0},
                  ${residuoBase?.codigoImobilizadoGenerico ?? 0},
                  "${residuoBase?.tara ?? 0}",
                  "${residuoBase?.cubagem ?? 0}",
                  ${residuoBase?.xImobilizadoGenerico ? 1 : 0},
                  ${residuoBase?.xColetarSomenteComEquipamento ? 1 : 0}
                )`;
          }

          await this.iResiduoRepositorio.inserirResiduosBaseSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
