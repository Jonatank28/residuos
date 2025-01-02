import { ApiException, ILocalStorageConnection } from 'vision-common';
import { $REST_VERSION_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class GetVersaoRestUseCase implements UseCase<void, string | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      return this.iLocalStorageConnection.getStorageDataString($REST_VERSION_KEY);
    } catch (e) {
      return ApiException(e);
    }
  };
}
