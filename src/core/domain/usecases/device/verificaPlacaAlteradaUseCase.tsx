import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $ALTER_BOARD_KEY } from '../../../constants';

export default class VerificaPlacaAlteradaUseCase implements UseCase<void, boolean | Error> {

  constructor(private readonly iLocalStorage: ILocalStorageConnection) { }

  async execute(): Promise<boolean | Error> {
    try {
      const response = await this.iLocalStorage.getStorageDataString($ALTER_BOARD_KEY);

      return !!(response && response !== null && response?.length > 0);
    } catch (e) {
      return ApiException(e);
    }
  };
}
