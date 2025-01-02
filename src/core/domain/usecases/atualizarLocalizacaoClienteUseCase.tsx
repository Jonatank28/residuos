import {
  ApiException, ApiUnknownException, ILocation, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import BadRequestException from '../exceptions/badRequestException';
import NotAcceptableException from '../exceptions/notAcceptableException';
import { IClienteRepositorio } from '../repositories/clienteRepositorio';

export interface IAtualizarLocalizacaoParams {
  location: ILocation;
  clienteID: number;
}

export default class AtualizarLocalizacaoClienteUseCase implements UseCase<IAtualizarLocalizacaoParams, void | Error> {

  constructor(private readonly iClienteRepositorio: IClienteRepositorio) {}

  async execute(params: IAtualizarLocalizacaoParams): Promise<void | Error> {
    try {
      const response = await this.iClienteRepositorio.atualizarLocalizacao(params);

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
