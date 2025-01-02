import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IUsuarioRepositorio } from '../repositories/usuarioRepositorio';

export default class AlterarFotoUsuarioUseCase implements UseCase<string, void | Error> {

  constructor(private readonly iUsuarioRepositorio: IUsuarioRepositorio) { }

  async execute(param: string): Promise<void | Error> {
    try {
      const response = await this.iUsuarioRepositorio.alterarFoto(param);

      if (!response || response.request.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          break;
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
