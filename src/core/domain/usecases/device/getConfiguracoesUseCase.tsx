import { ApiException, ILocalStorageConnection } from 'vision-common';
import { $SETTINGS_KEY } from '../../../constants';
import { IConfiguracao } from '../../entities/configuracao';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class GetConfiguracoesUseCase implements UseCase<void, IConfiguracao | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<IConfiguracao | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataObject<IConfiguracao>($SETTINGS_KEY);
      return response || {} as IConfiguracao;
    } catch (e) {
      return ApiException(e);
    }
  };
}
