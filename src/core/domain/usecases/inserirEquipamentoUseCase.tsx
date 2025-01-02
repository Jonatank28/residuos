import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { IEquipamento } from '../entities/equipamento';
import { IImobilizado } from '../entities/imobilizado';
import { IOrder } from '../entities/order';
import BadRequestException from '../exceptions/badRequestException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export interface IInserirEquipamentoParams {
  coleta: IOrder;
  equipamento: IImobilizado;
  placaID: number;
}

export default class InserirEquipamentoUseCase {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: IInserirEquipamentoParams): Promise<IEquipamento | Error> {
    try {
      const response = await this.iResiduosRepositorio.inserirEquipamento(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.CREATED:
          return response.data;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
