import { ApiException, ILocalStorageConnection } from 'vision-common';
import { $OFFLINE_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class GetOfflineUseCase implements UseCase<void, string | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataString($OFFLINE_KEY);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
