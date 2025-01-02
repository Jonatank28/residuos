import { ApiException } from 'vision-common';
import { IBalanca } from '../../../../entities/balanca/balanca';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceBalancaRepositorio } from '../../../../repositories/device/balancaRepositorio';

export default class UsecaseVerificarQuantidadeBalancas implements UseCase<void, void | IBalanca | Error> {

  constructor(private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio) { }

  async execute(): Promise<void | IBalanca | Error> {
    try {
      const response = await this.iDeviceBalancaRepositorio.pegarBalancas();

      if (response.length === 0)
        return;

      if (response.length > 1)
        return;

      return response._array[0];
    } catch (e) {
      return ApiException(e);
    }
  };
}
