import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { ApiException } from 'vision-common';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

type parametros = {
  codigoVinculo: string | number;
  imobilizado: IImobilizado;
}

export default class VincularImobilizadoNoResiduoUseCase
  implements UseCase<parametros, void | Error> {
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(parametros: parametros): Promise<void | Error> {
    try {
      await this.iDeviceResiduoRepositorio.vincularImobilizadoNoResiduo(parametros);
      return;
    } catch (e) {
      return ApiException(e);
    }
  }
}
