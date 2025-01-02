import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEquipamento } from '../../../entities/equipamento';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class GravarEquipamentosClienteUseCase implements UseCase<IEquipamento[], void | Error> {

  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(equipamentos: IEquipamento[]): Promise<void | Error> {
    try {
      for await (const equipamento of equipamentos) {
        await this.iResiduoRepositorio.inserirEquipamentoCliente(equipamento);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
