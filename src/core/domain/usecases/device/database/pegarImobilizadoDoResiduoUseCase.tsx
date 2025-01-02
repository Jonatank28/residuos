import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IImobilizado } from '../../../entities/imobilizado';
import { ApiException } from 'vision-common';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

type vinculo = string | number;
export default class PegarImobilizadoDoResiduoUseCase implements UseCase<vinculo, IImobilizado | Error> {
  constructor(private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(vinculo: vinculo): Promise<IImobilizado | Error> {
    try {
      let imobilizado: IImobilizado = {};

      const response = await this.iDeviceResiduoRepositorio.pegarImobilizadoDoResiduoVinculo(vinculo);

      if (response._array.length > 0) {
        imobilizado = response._array[0];
      }

      return imobilizado;
    } catch (e) {
      return ApiException(e);
    }
  }
}
