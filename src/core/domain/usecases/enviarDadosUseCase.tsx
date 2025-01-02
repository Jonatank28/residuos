import {
  ApiException, ApiUnknownException, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IAuditoria } from '../entities/auditoria';
import { IBalanca } from '../entities/balanca/balanca';
import { IClienteCheckIn } from '../entities/clienteCheckIn';
import BadRequestException from '../exceptions/badRequestException';
import DifferentMobileException from '../exceptions/differentMobileException';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

export interface IEnviarDadosParams {
  auditorias: IAuditoria[];
  balancas: IBalanca[];
  checkInClientes: IClienteCheckIn[];
  fotoUsuario?: string;
}

export default class EnviarDadosUseCase implements UseCase<IEnviarDadosParams, void | Error> {

  constructor(private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio) {}

  async execute(params: IEnviarDadosParams): Promise<void | Error> {
    try {
      const response = await this.iAutenticacaoRepositorio.enviarDados(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          break;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.FORBIDDEN:
          return DifferentMobileException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
