import { ApiException, ILocalStorageConnection, IVeiculo } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $VEICLE_KEY } from '../../../constants';

export default class GetVeiculoUseCase implements UseCase<void, IVeiculo | void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) {}

  async execute(): Promise<IVeiculo| void | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataObject<IVeiculo>($VEICLE_KEY);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
