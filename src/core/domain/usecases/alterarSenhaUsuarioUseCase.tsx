import {
  ApiException, ApiUnknownException, ILocalStorageConnection, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $USER_PASSWORD_KEY } from '../../constants';
import BadRequestException from '../exceptions/badRequestException';
import NotAcceptableException from '../exceptions/notAcceptableException';
import { IUsuarioRepositorio } from '../repositories/usuarioRepositorio';

export interface IAlterarSenhaUsuarioParams {
  senhaAtual: string;
  novaSenha: string;
}

export default class AlterarSenhaUsuarioUseCase implements UseCase<IAlterarSenhaUsuarioParams, void | Error> {
  constructor(
    private readonly iUsuarioRepositorio: IUsuarioRepositorio,
    private readonly iLocalStorageConnection: ILocalStorageConnection
  ) { }

  async execute(params: IAlterarSenhaUsuarioParams): Promise<void | Error> {
    try {
      const response = await this.iUsuarioRepositorio.alterarSenha(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.CREATED:
          await this.iLocalStorageConnection.setStorageDataString($USER_PASSWORD_KEY, params.novaSenha);
          break;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.NOT_ACCEPTABLE:
          return NotAcceptableException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
