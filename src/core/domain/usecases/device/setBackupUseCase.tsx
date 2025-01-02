import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $BACKUP_KEY } from '../../../constants';

export default class SetBackupUseCase implements UseCase<string, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(servidor: string): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataString($BACKUP_KEY, servidor);
    } catch (e) {
      return ApiException(e);
    }
  };
}
