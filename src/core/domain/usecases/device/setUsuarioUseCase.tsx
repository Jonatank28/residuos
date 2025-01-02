import { ApiException, ILocalStorageConnection } from 'vision-common';
import { IUsuario } from '../../entities/usuario';
import { $USER_DATA_KEY } from '../../../constants';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class SetUsuarioUseCase implements UseCase<IUsuario, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(usuario: IUsuario): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataObject($USER_DATA_KEY, usuario);
    } catch (e) {
      return ApiException(e);
    }
  };
}
