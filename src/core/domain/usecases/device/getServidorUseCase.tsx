import { ApiException, ILocalStorageConnection } from 'vision-common';
import { IServidor } from '../../entities/servidor';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $SERVER_KEY } from '../../../constants';

export default class GetServidorUseCase implements UseCase<void, IServidor | void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<IServidor | void | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataObject<IServidor>($SERVER_KEY);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
