import Constants from 'expo-constants';
import {
  ApiException, ApiUnknownException, ILocalStorageConnection, statusCode,
} from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { $VERSION_BLOCK_KEY } from '../../constants';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

export default class PegarVersaoRestUseCase implements UseCase<boolean, string | Error> {

  constructor(
    private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio,
    private readonly iLocalStorage: ILocalStorageConnection
  ) { }

  async execute(bloqueiaVersao?: boolean): Promise<string | Error> {
    try {
      const response = await this.iAutenticacaoRepositorio.pegarVersaoRest();

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const { versao } = response.data;

            await this.iLocalStorage.setStorageDataString(
              $VERSION_BLOCK_KEY,
              bloqueiaVersao && versao !== Constants?.manifest?.version ? 'BLOQUEAR' : '',
            );

            return versao;
          }
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
