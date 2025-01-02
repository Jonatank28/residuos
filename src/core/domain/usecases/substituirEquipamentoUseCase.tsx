import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEquipamento } from '../entities/equipamento';
import { IImobilizado } from '../entities/imobilizado';
import { IOrder } from '../entities/order';
import BadRequestException from '../exceptions/badRequestException';
import ForbiddenException from '../exceptions/forbiddenException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export interface ISubstituirEquipamentoParams {
  ordem: IOrder;
  equipamento: IEquipamento;
  novoEquipamento: IImobilizado;
  placaID: number;
}

export default class SubstituirEquipamentoUseCase implements UseCase<ISubstituirEquipamentoParams, IEquipamento | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: ISubstituirEquipamentoParams): Promise<IEquipamento | Error> {
    try {
      const response = await this.iResiduosRepositorio.substituirEquipamento(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          return response.data;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.FORBIDDEN:
          return ForbiddenException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
