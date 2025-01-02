import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IClienteCheckIn } from '../../../../entities/clienteCheckIn';
import { IDeviceClienteRepositorio } from '../../../../repositories/device/clienteRepositorio';

export default class PegarCheckinClientePorCodigoOSDeviceUseCase implements UseCase<number, IClienteCheckIn | Error> {
  constructor(private readonly iClienteRepositorio: IDeviceClienteRepositorio) {}

  async execute(codigoOS: number): Promise<IClienteCheckIn | Error> {
    try {
      let checkin: IClienteCheckIn = {};
      const response = await this.iClienteRepositorio.pegarCheckinPorCodigoOSDevice(codigoOS);

      if (response && response?.ordemServico) {
        checkin = response;
      }

      return checkin;
    } catch (e) {
      return ApiException(e);
    }
  }
}
