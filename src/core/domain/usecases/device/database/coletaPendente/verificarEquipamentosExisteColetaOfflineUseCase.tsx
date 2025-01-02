import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEquipamento } from '../../../../entities/equipamento';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export default class VerificarEquipamentosExisteColetaOffline implements UseCase<IOrder, IEquipamento[] | Error> {
  constructor(private readonly iResiduosRepositorio: IDeviceResiduoRepositorio) {}

  async execute(coleta: IOrder): Promise<IEquipamento[] | Error> {
    try {
      let equipamentos: IEquipamento[] = [];

      const codigo =
        coleta.codigoOS && coleta.codigoOS !== 0
          ? `@VRCOLETAAGENDADAPENDENTE:${coleta.codigoOS}`
          : `@VRNOVACOLETAPENDENTE:${coleta.codigoCliente}`;

      const equipamentosResponse = await this.iResiduosRepositorio.pegarEquipamentos(codigo);

      if (equipamentosResponse.length > 0) equipamentos = equipamentosResponse._array;

      return equipamentos;
    } catch (e) {
      return ApiException(e);
    }
  }
}
