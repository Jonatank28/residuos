import { IResiduo } from '../../entities/residuo';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';
import { ApiException, removerQuebrasLinha, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';

export interface IGravarResiduosContratoParams {
  residuosContrato: IResiduo[];
  userID: number;
}

export default class GravarResiduoContratoUseCase implements UseCase<IGravarResiduosContratoParams, void | Error> {

  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(params: IGravarResiduosContratoParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksResiduosContrato = splitArrayIntoChunksOfLen(params.residuosContrato, chunksLength);

      if (chunksResiduosContrato?.length > 0) {
        for await (const chunkResiduosContrato of chunksResiduosContrato) {
          let sqlParams: string = '';

          for await (const residuoContrato of chunkResiduosContrato) {
            sqlParams += `${sqlParams.length > 0 ? ',' : ''}(
                ${params.userID},
                ${residuoContrato?.codigo ?? 0},
                ${residuoContrato?.xExigeInteiro ? 1 : 0},
                ${residuoContrato?.codigoContrato && residuoContrato.codigoContrato !== 0 ? residuoContrato.codigoContrato : null},
                ${residuoContrato?.codigoServico && residuoContrato.codigoServico !== 0 ? residuoContrato.codigoServico : null},
                ${residuoContrato?.codigoCliente && residuoContrato.codigoCliente !== 0 ? residuoContrato.codigoCliente : null},
                "${replaceString(residuoContrato?.descricao ?? '')}",
                "${replaceString(residuoContrato?.cor ?? '')}",
                "${replaceString(residuoContrato?.unidade ?? '')}",
                ${residuoContrato?.quantidade ?? 0},
                "${replaceString(residuoContrato?.subGrupo ?? '')}",
                "${removerQuebrasLinha(replaceString(residuoContrato?.observacao ?? ''))}",
                ${residuoContrato?.xResiduo ? 1 : 0},
                ${residuoContrato?.naoConforme ? 1 : 0},
                ${residuoContrato?.excesso ? 1 : 0},
                "${replaceString(residuoContrato?.codigoIbama ?? '')}",
                ${residuoContrato?.codigoEstadoFisico ?? null},
                ${residuoContrato?.codigoSubGrupo ?? null},
                ${residuoContrato?.codigoAcondicionamento ?? null},
                ${residuoContrato?.codigoUnidade ?? null},
                ${residuoContrato?.codigoFormaTratamento ?? null},
                ${residuoContrato?.valorUnitario ?? 0},
                ${residuoContrato?.codigoImobilizadoGenerico ?? 0},
                "${residuoContrato?.tara ?? 0}",
                "${residuoContrato?.cubagem ?? 0}",
                ${residuoContrato?.xImobilizadoGenerico ? 1 : 0},
                ${residuoContrato?.xColetarSomenteComEquipamento ? 1 : 0}
              )`;
          }

          await this.iResiduoRepositorio.inserirResiduosContratoSincronizacao(sqlParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
