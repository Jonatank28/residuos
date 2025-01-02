import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $LOCALIZATION_KEY } from '../../../constants';

export default class SetCompartilharLocalizacaoUseCase implements UseCase<string, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(codigoOS: string): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataString($LOCALIZATION_KEY, codigoOS);
    } catch (e) {
      return ApiException(e);
    }
  };
}
