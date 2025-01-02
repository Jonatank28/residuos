import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $REST_VERSION_KEY } from '../../../constants';

export default class SetVersaoRestUseCase implements UseCase<string, void | Error> {

  constructor(private readonly iLocalStorage: ILocalStorageConnection) { }

  async execute(versaoRest: string): Promise<void | Error> {
    try {
      await this.iLocalStorage.setStorageDataString($REST_VERSION_KEY, versaoRest);
    } catch (e) {
      return ApiException(e);
    }
  };
}
