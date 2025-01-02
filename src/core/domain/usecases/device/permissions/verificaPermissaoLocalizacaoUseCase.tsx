import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceLocalizacaoRepositorio } from '../../../repositories/device/localizacaoRepositorio';

export default class VerificaPermissaoLocalizacaoUseCase implements UseCase<void, boolean | Error> {

  constructor(private readonly iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio) { }

  async execute(): Promise<boolean | Error> {
    try {
      return this.iLocalizacaoRepositorio.verificaPermissaoLocalizacao();
    } catch (e) {
      return ApiException(e);
    }
  };
}
