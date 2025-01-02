import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $LOCALIZATION_KEY } from '../../../constants';

export default class GetCompartilharLocalizacaoUseCase implements UseCase<void, string | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      return await this.iLocalStorageConnection.getStorageDataString($LOCALIZATION_KEY);
    } catch (e) {
      return ApiException(e);
    }
  };
}
