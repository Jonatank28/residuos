import { ApiException } from 'vision-common';
import { IBalanca } from '../../../../entities/balanca/balanca';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceBalancaRepositorio } from '../../../../repositories/device/balancaRepositorio';
import BadRequestException from 'vision-common/src/core/domain/exceptions/badRequestException';

export default class UsecaseAtualizarBalanca implements UseCase<IBalanca, number | Error> {

  constructor(private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio) { }

  async execute(parametro: IBalanca): Promise<number | Error> {
    try {
      if (!parametro?.codigo)
        return BadRequestException('Código da balança inválido');

      const response = await this.iDeviceBalancaRepositorio.editarBalanca(parametro);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
