import { ApiException } from 'vision-common';
import { IResiduo } from '../../../entities/residuo';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class UsecasePegarImobilizadoGenericoPorCodigo implements UseCase<number, IResiduo | Error> {
  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(residuoID: number): Promise<IResiduo | Error> {
    try {
      const residuoNormal = await this.iResiduoRepositorio.pegarImobilizadoGenericoPorCodigo(residuoID, 'RESIDUOS');

      if (residuoNormal?.codigo) return residuoNormal;

      const residuoBase = await this.iResiduoRepositorio.pegarImobilizadoGenericoPorCodigo(residuoID, 'RESIDUOS_BASE');

      if (residuoBase?.codigo) return residuoBase;
      
      const residuoContrato = await this.iResiduoRepositorio.pegarImobilizadoGenericoPorCodigo(residuoID, 'RESIDUOS_CONTRATO');
      
      if (residuoContrato?.codigo) return residuoContrato;

      return {};
    } catch (e) {
      return ApiException(e);
    }
  }
}
