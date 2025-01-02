import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $REGIONS_KEY } from '../../../constants';
import { IRegiao } from '../../entities/regiao';

export default class SetRegioesUseCase implements UseCase<IRegiao[], void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(regioes: IRegiao[]): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataObject($REGIONS_KEY, regioes);
    } catch (e) {
      return ApiException(e);
    }
  };
}
