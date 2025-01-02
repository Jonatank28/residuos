import {
  ApiException, ApiUnknownException, ILocation, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import BadRequestException from '../exceptions/badRequestException';
import NotAcceptableException from '../exceptions/notAcceptableException';
import { IUsuarioRepositorio } from '../repositories/usuarioRepositorio';

export interface IAtualizarLocalizacaoMotoristaParams {
  location: ILocation;
  codigoOS: number;
}

export default class AtualizarLocalizacaoMotoristaUseCase implements UseCase<IAtualizarLocalizacaoMotoristaParams, void | Error> {

  constructor(private readonly iUsuarioRepositorio: IUsuarioRepositorio) {}

  async execute(params: IAtualizarLocalizacaoMotoristaParams): Promise<void | Error> {
    try {
      const response = await this.iUsuarioRepositorio.atualizarLocalizacao(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.CREATED:
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
