import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceRascunhoRepositorio } from '../../../../repositories/device/rascunhoRepositoiro';

export default class VerificaRascunhoExisteUseCase implements UseCase<string, boolean | Error> {

  constructor(private readonly iRascunhoRepositorio: IDeviceRascunhoRepositorio) { }

  async execute(codigo: string): Promise<boolean | Error> {
    try {
      const response = await this.iRascunhoRepositorio.verificaRascunhoExiste(codigo);

      return !!(response && response !== 0);
    } catch (e) {
      return ApiException(e);
    }
  };
}
