import I18n from 'i18n-js';
import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEquipamento } from '../entities/equipamento';
import BadRequestException from '../exceptions/badRequestException';
import ForbiddenException from '../exceptions/forbiddenException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export interface IRemoverEquipamentoParams {
  equipamento: IEquipamento;
  placaID: number;
  codigoOS: number;
  ordemID: number
}

export default class RemoverEquipamentoUseCase implements UseCase<IRemoverEquipamentoParams, void | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: IRemoverEquipamentoParams): Promise<void | Error> {
    try {
      const response = await this.iResiduosRepositorio.removerEquipamento(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          break;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.FORBIDDEN:
          return ForbiddenException(I18n.t('screens.collectEquipament.removeForbidden'));
        case statusCode.CONFLICT:
          return ForbiddenException('Este Imobilizado possui Etapas de Manutenção já realizadas, devido a isso não será possível excluir');
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
