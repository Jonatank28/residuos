import { ApiException, ILocalStorageConnection } from 'vision-common';
import { IUsuario } from '../../entities/usuario';
import { $USER_DATA_KEY } from '../../../constants';

export default class GetUsuarioUseCase {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<IUsuario | void | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataObject<IUsuario>($USER_DATA_KEY);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
