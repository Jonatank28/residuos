import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $BLOCKED_KEY } from '../../../constants';

export default class GetBloqueioUseCase implements UseCase<void, string | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      return this.iLocalStorageConnection.getStorageDataString($BLOCKED_KEY);
    } catch (e) {
      return ApiException(e);
    }
  };
}
