import { ApiException } from 'vision-common';
import { IChecklist } from '../../../entities/checklist';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceChecklistRepositorio } from '../../../repositories/device/checklistRepositorio';

export interface IGravarChecklistParams {
  codigoOS: number;
  checklist: IChecklist;
}

export default class GravarChecklistUseCase implements UseCase<IGravarChecklistParams, void | Error> {

  constructor(private readonly iChecklistRepositorio: IDeviceChecklistRepositorio) { }

  async execute(params: IGravarChecklistParams): Promise<void | Error> {
    try {
      await this.iChecklistRepositorio.deletarChecklist(params.codigoOS);
      await this.iChecklistRepositorio.inserirChecklist(params.checklist, params.codigoOS);
    } catch (e) {
      return ApiException(e);
    }
  };
}
