import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $TOKEN_KEY } from '../../../constants';

export default class GetTokenUseCase implements UseCase<void, string | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataString($TOKEN_KEY);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
