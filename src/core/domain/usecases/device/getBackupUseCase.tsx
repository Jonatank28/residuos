import { $BACKUP_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ApiException, ILocalStorageConnection } from 'vision-common';

export default class GetBackupUseCase implements UseCase<void, string | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      return this.iLocalStorageConnection.getStorageDataString($BACKUP_KEY);
    } catch (e) {
      return ApiException(e);
    }
  };
}
