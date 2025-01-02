import { ApiException } from 'vision-common';
import { IBalanca } from '../../../../entities/balanca/balanca';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceBalancaRepositorio } from '../../../../repositories/device/balancaRepositorio';

export default class UsecaseCadastrarBalanca implements UseCase<IBalanca, number | Error> {

  constructor(private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio) { }

  async execute(parametro: IBalanca): Promise<number | Error> {
    try {
      if (parametro.codigo && parametro.codigo !== 0)
        parametro.codigoBalancaController = parametro.codigo;

      const response = await this.iDeviceBalancaRepositorio.inserirBalanca(parametro);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
