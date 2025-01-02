import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import NotFoundException from 'vision-common/src/core/domain/exceptions/notFoundException';
import { $LAST_SYNC_KEY } from '../../../constants';
import { IDadosDispositivo } from '../../entities/dadosDispositivo';
import { IDeviceAuditoriaRepositorio } from '../../repositories/device/auditoriaRepositorio';

export default class PegarDadosDispositivoDeviceUseCase implements UseCase<string, IDadosDispositivo | Error> {
  constructor(
    private readonly iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio,
    private readonly iLocalStorageConnection: ILocalStorageConnection
  ) { }

  async execute(placa: string): Promise<IDadosDispositivo | Error> {
    try {
      if (!placa) {
        return NotFoundException('Você deve informar a placa');
      }

      const response = await this.iDeviceAuditoriaRepositorio.pegarDadosTotaisDispositivo(placa);

      response.ultimaSincronizacao = new Date(await this.iLocalStorageConnection.getStorageDataString($LAST_SYNC_KEY));

      const totalColetaPendentesHoje = (response?.totalColetasHoje ?? 0) - (response?.totalColetasRealizadasHoje ?? 0);
      response.totalColetasPendentesHoje = totalColetaPendentesHoje || 0;

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
