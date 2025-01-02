import { ApiException, ILocalStorageConnection, IVeiculo } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $ALTER_BOARD_KEY, $VEICLE_KEY } from '../../../constants';

export default class SetVeiculoUseCase implements UseCase<IVeiculo, void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(veiculo: IVeiculo): Promise<void | Error> {
    try {
      await this.iLocalStorageConnection.setStorageDataObject($VEICLE_KEY, veiculo);
      await this.iLocalStorageConnection.setStorageDataString($ALTER_BOARD_KEY, veiculo?.placa ?? '');
    } catch (e) {
      return ApiException(e);
    }
  };
}
