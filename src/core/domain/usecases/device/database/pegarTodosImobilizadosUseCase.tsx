import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export interface IPegarTodosImobilizadosUseCaseParametros {
  paginacao: IPaginationParams;
}

export default class PegarTodosImobilizadosDeviceUseCase
  implements UseCase<IPegarTodosImobilizadosUseCaseParametros, IPaginationResponse<IImobilizado> | Error> {
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(parametros: IPegarTodosImobilizadosUseCaseParametros): Promise<IPaginationResponse<IImobilizado> | Error> {
    try {
      let equipamentosList: IImobilizado[] = [];

      const response = await this.iDeviceResiduoRepositorio.pegarTodosImobilizados(parametros);

      if (response._array.length > 0) {
        equipamentosList = response._array;
      }

      return {
        ...parametros.paginacao,
        items: equipamentosList ?? [],
        pages: Math.ceil(equipamentosList.length / parametros.paginacao.amount) ?? 0,
        length: equipamentosList.length ?? 0,
      };
    } catch (e) {
      return ApiException(e);
    }
  }
}
