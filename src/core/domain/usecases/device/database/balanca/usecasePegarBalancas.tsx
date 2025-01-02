import { ApiException } from 'vision-common';
import { IBalanca } from '../../../../entities/balanca/balanca';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceBalancaRepositorio } from '../../../../repositories/device/balancaRepositorio';

export default class UsecasePegarBalancas implements UseCase<void, IBalanca[] | Error> {

  constructor(private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio) { }

  async execute(): Promise<IBalanca[] | Error> {
    try {
      const response = await this.iDeviceBalancaRepositorio.pegarBalancas();

      return response._array;
    } catch (e) {
      return ApiException(e);
    }
  };
}
