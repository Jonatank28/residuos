import { ApiException, ILocalStorageConnection } from 'vision-common';
import { $SERVER_KEY } from '../../../constants';
import { IServidor } from '../../entities/servidor';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class SetServidorUseCase implements UseCase<IServidor, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(servidor: IServidor): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataObject($SERVER_KEY, servidor);
    } catch (e) {
      return ApiException(e);
    }
  };
}
