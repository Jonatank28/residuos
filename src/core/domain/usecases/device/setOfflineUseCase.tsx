import { ApiException, ILocalStorageConnection } from 'vision-common';
import { $OFFLINE_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class SetOfflineUseCase implements UseCase<boolean, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(offline: boolean): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataString($OFFLINE_KEY, offline ? 'isOFF' : 'isON');
    } catch (e) {
      return ApiException(e);
    }
  };
}
