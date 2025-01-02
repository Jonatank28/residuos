import {
  ApiException, ApiUnknownException, ILocalStorageConnection, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $SETTINGS_KEY } from '../../constants';
import { IConfiguracao } from '../entities/configuracao';
import { IUsuarioRepositorio } from '../repositories/usuarioRepositorio';

export default class PegarConfiguracoesUseCase implements UseCase<void, IConfiguracao | Error> {

  constructor(
    private readonly iUsuarioRepositorio: IUsuarioRepositorio,
    private readonly iLocalStorage: ILocalStorageConnection
  ) { }

  async execute(): Promise<IConfiguracao | Error> {
    try {
      const response = await this.iUsuarioRepositorio.pegarConfiguracoes();

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            await this.iLocalStorage.setStorageDataObject($SETTINGS_KEY, response.data);
            return response.data;
          }
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
