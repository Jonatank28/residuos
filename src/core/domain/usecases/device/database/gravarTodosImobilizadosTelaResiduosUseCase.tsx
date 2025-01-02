import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export interface IGravarImobilizadosParams {
    imobilizados: IImobilizado[];
    userID: number;
    mostraImobilizadoTelaResiduosAPP?: boolean;
}

export default class GravarTodosImobilizadosTelaResiduosUseCase implements UseCase<IGravarImobilizadosParams, void | Error> {

    constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) { }

    async execute(params: IGravarImobilizadosParams): Promise<void | Error> {
        try {
            if (!params.mostraImobilizadoTelaResiduosAPP) {
                const chunksLength = 999;
                const chunksImobilizados = splitArrayIntoChunksOfLen(params.imobilizados, chunksLength);

                if (chunksImobilizados?.length > 0) {
                    for await (const chunkImobilizados of chunksImobilizados) {
                        let sqlParams: string = '';

                        for await (const imobilizado of chunkImobilizados) {

                            sqlParams += `
                ${sqlParams.length > 0 ? ',' : ''}(
                ${params.userID},
                ${imobilizado?.codigo ?? 0},
                "${replaceString(imobilizado?.descricao ?? '')}",
                "${replaceString(imobilizado?.unidade ?? '')}",
                "${replaceString(imobilizado?.identificacao ?? '')}",
                ${Number(imobilizado?.quantidade ?? 0)},
                ${imobilizado?.movimentado ? 1 : 0},
                ${imobilizado?.naoGerarMovimentacao ? 1 : 0},
                ${imobilizado?.xPesoEResiduoImobilizado ? 1 : 0},
                ${imobilizado?.codigoImobilizadoGenerico ?? 0},
                "${imobilizado?.tara ?? 0}",
                ${0},
                "${imobilizado?.cubagem ?? 0}",
                ${imobilizado?.valorUnitario ?? 0}
              )`;
                        }

                        await this.iResiduoRepositorio.inserirImobilizadosSincronizacao(sqlParams);
                    }
                }
            } else {
                //TO-DO - ajustar o foreach para o for await
                params.imobilizados.forEach(async imobilizado => {
                    await this.iResiduoRepositorio.inserirTodosImobilizadosSincronizacao(`(
            ${imobilizado?.codigo},
            "${replaceString(imobilizado?.descricao ?? '')}",
            "${imobilizado?.tara ?? 0}",
            ${Number(imobilizado?.pesoLiquido) ?? 0},
            ""
            )`);
                })
            }
        } catch (e) {
            return ApiException(e);
        }
    };
}
