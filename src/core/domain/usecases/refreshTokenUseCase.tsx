import I18n from 'i18n-js';
import {
  ApiException, ApiUnknownException, ILocalStorageConnection, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $TOKEN_KEY } from '../../constants';
import ForbiddenException from '../exceptions/forbiddenException';
import InvalidLoginException from '../exceptions/invalidLoginException';
import NotAuthorizedException from '../exceptions/notAuthorizedException';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

interface IAuthUser {
  usuario?: string;
  password?: string;
}

export default class RefreshTokenUseCase implements UseCase<void, string | void | Error> {

  constructor(
    private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio,
    private readonly iLocalStorage: ILocalStorageConnection
  ) { }

  async execute(): Promise<string | void | Error> {
    try {
      const usuario: IAuthUser | null = await this.iAutenticacaoRepositorio.pegarUsuarioAtual();

      if (usuario !== null && usuario?.usuario && usuario?.password) {
        const response = await this.iAutenticacaoRepositorio.logarUsuario({
          user: usuario.usuario,
          password: usuario.password
        });

        if (!response || response.request?.status === 0) return ApiException(response);

        switch (response.status) {
          case statusCode.OK:
            {
              const { token } = response.data;

              if (token) {
                await this.iLocalStorage.setStorageDataString($TOKEN_KEY, token);
              }

              return token;
            }
          case statusCode.BAD_REQUEST:
            return InvalidLoginException();
          case statusCode.UNAUTORIZED:
            return NotAuthorizedException();
          case statusCode.FORBIDDEN:
            return ForbiddenException(I18n.t('exceptions.customs.loginExist'));
          default:
            return ApiUnknownException(response);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
