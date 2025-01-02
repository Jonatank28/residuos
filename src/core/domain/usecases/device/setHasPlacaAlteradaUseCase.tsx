import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $ALTER_BOARD_KEY, $LAST_SYNC_KEY } from '../../../constants';

export default class SetHasPlacaAlteradaUseCase implements UseCase<string, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(placa: string): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataString($ALTER_BOARD_KEY, placa);
      await this.iLocalStorageConnection.setStorageDataString($LAST_SYNC_KEY, String(new Date()));
    } catch (e) {
      return ApiException(e);
    }
  };
}
