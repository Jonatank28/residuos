import I18n from 'i18n-js';
import {
  ApiException, ApiUnknownException, ILocalStorageConnection, statusCode,
} from 'vision-common';
import { $TOKEN_KEY, $USER_KEY, $USER_PASSWORD_KEY } from '../../constants';
import ForbiddenException from '../exceptions/forbiddenException';
import InvalidLoginException from '../exceptions/invalidLoginException';
import NotAuthorizedException from '../exceptions/notAuthorizedException';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

export interface ILogarUsuarioParams {
  user: string;
  password: string;
}

export default class LogarUsuarioUseCase {

  constructor(
    private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio,
    private readonly iLocalStorage: ILocalStorageConnection
  ) { }

  async execute(params: ILogarUsuarioParams): Promise<string | Error> {
    try {
      const response = await this.iAutenticacaoRepositorio.logarUsuario(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const { token } = response.data;

            await this.iLocalStorage.setStorageDataString($USER_KEY, params.user);
            await this.iLocalStorage.setStorageDataString($USER_PASSWORD_KEY, params.password);

            if (token) {
              await this.iLocalStorage.setStorageDataString($TOKEN_KEY, token);
            }

            return token;
          }
        case statusCode.BAD_REQUEST:
          return InvalidLoginException();
        case statusCode.FORBIDDEN:
          return ForbiddenException(I18n.t('exceptions.customs.loginExist'));
        case statusCode.UNAUTORIZED:
          return NotAuthorizedException();
        case statusCode.NOT_FOUND:
          return NotAuthorizedException(I18n.t('exceptions.customs.notFoundMobile'));
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
