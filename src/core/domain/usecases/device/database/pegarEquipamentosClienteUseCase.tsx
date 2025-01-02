import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEquipamento } from '../../../entities/equipamento';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export interface IPegarEquipamentosClienteDeviceUseCaseParams {
  clienteID: number;
  obraID?: number;
  semObra?: boolean
}

export default class PegarEquipamentosClienteUseCase implements UseCase<IPegarEquipamentosClienteDeviceUseCaseParams, IEquipamento[] | Error> {

  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) { }

  async execute(params: IPegarEquipamentosClienteDeviceUseCaseParams): Promise<IEquipamento[] | Error> {
    try {
      let equipamentos: IEquipamento[] = [];

      const response = await this.iResiduoRepositorio.pegarEquipamentosCliente(params);

      if (response.length > 0) {
        equipamentos = response._array;
      }

      return equipamentos;
    } catch (e) {
      return ApiException(e);
    }
  };
}
