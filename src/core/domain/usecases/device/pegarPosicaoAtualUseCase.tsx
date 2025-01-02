import { LocationObject } from 'expo-location';
import { ApiException } from 'vision-common';
import NoLocationException from '../../exceptions/noLocationException';
import { IDeviceLocalizacaoRepositorio } from '../../repositories/device/localizacaoRepositorio';

export default class PegarPosicaoAtualUseCase {

  constructor(private readonly iLocalizacaoRepositorio: IDeviceLocalizacaoRepositorio) { }

  async execute(): Promise<LocationObject | Error> {
    try {
      const response = await this.iLocalizacaoRepositorio.pegarLocalizacaoAtual();

      if (response === null) {
        return NoLocationException('Não foi possivel pegar a posição atual');
      }

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
