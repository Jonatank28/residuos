import { ApiException, ILocalStorageConnection } from 'vision-common';
import { $BLOCKED_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class SetBloqueioUseCase implements UseCase<string, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(bloqueio: string): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataString($BLOCKED_KEY, bloqueio);
    } catch (e) {
      return ApiException(e);
    }
  };
}
