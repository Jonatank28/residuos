import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceLocalizacaoRepositorio } from '../../../repositories/device/localizacaoRepositorio';

export default class RequisitaPermissaoLocalizacaoUseCase implements UseCase<void, void | Error> {

  constructor(private readonly iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio) { }

  async execute(): Promise<void | Error> {
    try {
      await this.iLocalizacaoRepositorio.requisitaPermissaoLocalizacao();
    } catch (e) {
      return ApiException(e);
    }
  };
}
