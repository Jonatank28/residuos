import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IUsuario } from '../entities/usuario';
import { IUsuarioRepositorio } from '../repositories/usuarioRepositorio';

export default class PegarUsuarioUseCase implements UseCase<void, IUsuario | Error> {

  constructor(private readonly iUsuarioRepositorio: IUsuarioRepositorio) { }

  async execute(): Promise<IUsuario | Error> {
    try {
      const response = await this.iUsuarioRepositorio.pegarUsuario();

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          return response.data;
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
