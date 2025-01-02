import { IEquipamento } from '../../../entities/equipamento';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';
import { IResiduo } from '../../../entities/residuo';

export interface IPegarImobilizadosUseCaseParams {
  contratoID: number;
  equipamentosAdicionados: IEquipamento[];
  residuosAdicionados: IResiduo[];
  pagination: IPaginationParams;
  xSomenteEquipamentosLiberados: boolean;
  somenteEquipamentosGenericos: boolean;
}

export default class PegarImobilizadosContratosUseCase
  implements UseCase<IPegarImobilizadosUseCaseParams, IPaginationResponse<IImobilizado> | Error>
{
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(params: IPegarImobilizadosUseCaseParams): Promise<IPaginationResponse<IImobilizado> | Error> {
    try {
      let totalPaginas = 0;
      let equipamentosList: IImobilizado[] = [];
      let codigosEquipamentosJaAdicionados: number[] = [];

      if (params.equipamentosAdicionados) {
        params.equipamentosAdicionados.forEach(equipamento => {
          if (equipamento.codigoContainer) {
            codigosEquipamentosJaAdicionados.push(equipamento.codigoContainer);
          }
        });
      }

      if (params.residuosAdicionados) {
        params.residuosAdicionados.forEach(equipamentoGenerico => {
          if (
            equipamentoGenerico.codigoImobilizadoReal &&
            !codigosEquipamentosJaAdicionados.includes(Number(equipamentoGenerico.codigoImobilizadoReal))
          ) {
            codigosEquipamentosJaAdicionados.push(Number(equipamentoGenerico.codigoImobilizadoReal));
          }
        });
      }

      const totalLinhas = await this.iDeviceResiduoRepositorio.pegarTotalLinhasImobilizadosContratos(
        params,
        codigosEquipamentosJaAdicionados,
      );
      const response = await this.iDeviceResiduoRepositorio.pegarImobilizadosContratos(params, codigosEquipamentosJaAdicionados);

      if (totalLinhas && totalLinhas !== 0) {
        totalPaginas = Math.ceil(totalLinhas / params.pagination.amount);

        equipamentosList = response._array;
      }

      return {
        ...params.pagination,
        items: equipamentosList ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0,
      };
    } catch (e) {
      return ApiException(e);
    }
  }
}
