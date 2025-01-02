import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';
import { IEquipamento } from '../../../entities/equipamento';

export interface IPegarImobilizadosUseCaseParametros {
  paginacao: IPaginationParams;
  equipamentosAdicionados: IEquipamento[];
  xSomenteEquipamentosLiberados: boolean;
}

export default class PegarImobilizadosUseCase
  implements UseCase<IPegarImobilizadosUseCaseParametros, IPaginationResponse<IImobilizado> | Error>
{
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(parametros: IPegarImobilizadosUseCaseParametros): Promise<IPaginationResponse<IImobilizado> | Error> {
    try {
      let totalPaginas = 0;
      let equipamentosList: IImobilizado[] = [];

      let codigosEquipamentosJaAdicionados: number[] = [];

      if (parametros.equipamentosAdicionados) {
        parametros.equipamentosAdicionados.forEach(equipamento => {
          if (equipamento.codigoContainer) {
            codigosEquipamentosJaAdicionados.push(equipamento.codigoContainer);
          }
        });
      }

      const totalLinhas = await this.iDeviceResiduoRepositorio.pegarTotalLinhasImobilizados(codigosEquipamentosJaAdicionados);
      const response = await this.iDeviceResiduoRepositorio.pegarImobilizados(parametros, codigosEquipamentosJaAdicionados);

      if (totalLinhas && totalLinhas !== 0) {
        totalPaginas = Math.ceil(totalLinhas / parametros.paginacao.amount);

        if (response.length > 0) {
          equipamentosList = response._array;
        }
      }

      return {
        ...parametros.paginacao,
        items: equipamentosList ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0,
      };
    } catch (e) {
      return ApiException(e);
    }
  }
}
