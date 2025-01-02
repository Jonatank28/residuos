import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceBalancaRepositorio } from '../../../../repositories/device/balancaRepositorio';

export default class UsecaseDeletarBalanca implements UseCase<number, boolean | Error> {

  constructor(private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio) { }

  async execute(balancaID: number): Promise<boolean | Error> {
    try {
      const response = await this.iDeviceBalancaRepositorio.deletarBalanca(balancaID);

      return response > 0;
    } catch (e) {
      return ApiException(e);
    }
  };
}
