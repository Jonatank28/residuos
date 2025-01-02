import {
  ApiException, ApiUnknownException, ILocalStorageConnection, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $ALTER_BOARD_KEY, $BACKUP_KEY, $CHECKIN_KEY, $LAST_SYNC_KEY, $OFFLINE_KEY, $REGIONS_KEY, $REST_VERSION_KEY, $SETTINGS_KEY, $THEME_KEY, $TOKEN_KEY, $USER_DATA_KEY, $USER_KEY, $USER_PASSWORD_KEY, $VEICLE_KEY } from '../../constants';
import BadRequestException from '../exceptions/badRequestException';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

export default class DeslogarUseCase implements UseCase<void, void | Error> {

  constructor(
    private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio,
    private readonly ILocalStorageConnection: ILocalStorageConnection
  ) { }

  async execute(): Promise<void | Error> {
    try {
      const response = await this.iAutenticacaoRepositorio.deslogar();

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          await this.ILocalStorageConnection.removeItem($USER_KEY);
          await this.ILocalStorageConnection.removeItem($USER_PASSWORD_KEY);
          await this.ILocalStorageConnection.removeItem($USER_DATA_KEY);
          await this.ILocalStorageConnection.removeItem($TOKEN_KEY);
          await this.ILocalStorageConnection.removeItem($THEME_KEY);
          await this.ILocalStorageConnection.removeItem($VEICLE_KEY);
          await this.ILocalStorageConnection.removeItem($REGIONS_KEY);
          await this.ILocalStorageConnection.removeItem($OFFLINE_KEY);
          await this.ILocalStorageConnection.removeItem($CHECKIN_KEY);
          await this.ILocalStorageConnection.removeItem($SETTINGS_KEY);
          await this.ILocalStorageConnection.removeItem($ALTER_BOARD_KEY);
          await this.ILocalStorageConnection.removeItem($VEICLE_KEY);
          await this.ILocalStorageConnection.removeItem($REST_VERSION_KEY);
          await this.ILocalStorageConnection.removeItem($LAST_SYNC_KEY);
          await this.ILocalStorageConnection.removeItem($BACKUP_KEY);
          break;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.FORBIDDEN:
          break;
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
