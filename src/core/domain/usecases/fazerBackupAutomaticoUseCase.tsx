import I18n from 'i18n-js';
import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import BadRequestException from '../exceptions/badRequestException';
import ForbiddenException from '../exceptions/forbiddenException';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

export default class FazerBackupAutomaticoUseCase implements UseCase<FormData, void | Error> {

  constructor(private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio) { }

  async execute(param: FormData): Promise<void | Error> {
    try {
      const response = await this.iAutenticacaoRepositorio.fazerBackupAutomatico(param);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.CREATED:
          break;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.FORBIDDEN:
          return ForbiddenException(I18n.t('screens.backup.noPermission'));
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
