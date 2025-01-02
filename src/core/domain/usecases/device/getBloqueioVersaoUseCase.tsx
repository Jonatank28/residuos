import { ApiException, ILocalStorageConnection } from 'vision-common';
import { IConfiguracao } from '../../entities/configuracao';
import { $SETTINGS_KEY, $VERSION_BLOCK_KEY } from '../../../constants';

export default class GetBloqueioVersaoUseCase {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<string | Error> {
    try {
      const bloqueio = await this.iLocalStorageConnection.getStorageDataString($VERSION_BLOCK_KEY);
      const response = await this.iLocalStorageConnection.getStorageDataObject<IConfiguracao>($SETTINGS_KEY);

      if (response && response?.obrigarAtualizarSincronizacao && bloqueio) {
        return bloqueio;
      }

      return '';
    } catch (e) {
      return ApiException(e);
    }
  };
}
