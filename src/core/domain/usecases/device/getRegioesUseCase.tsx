import { $REGIONS_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { ApiException, ILocalStorageConnection } from 'vision-common';

export default class GetRegioesUseCase implements UseCase<void, any | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<any | Error> {
    try {
      return this.iLocalStorageConnection.getStorageDataObject($REGIONS_KEY);
    } catch (e) {
      return ApiException(e);
    }
  };
}
