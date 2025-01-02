import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import NotFoundException from 'vision-common/src/core/domain/exceptions/notFoundException';
import { $LAST_SYNC_KEY } from '../../../constants';
import { IDadosRelatorio } from '../../entities/dadosRelatorio';
import { IDeviceAuditoriaRepositorio } from '../../repositories/device/auditoriaRepositorio';
import { IDeviceRascunhoRepositorio } from '../../repositories/device/rascunhoRepositoiro';

export default class PegarDadosRelatorioDeviceUseCase implements UseCase<string, IDadosRelatorio | Error> {
  constructor(
    private readonly iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio,
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio,
    private readonly iLocalStorageConnection: ILocalStorageConnection
  ) { }

  async execute(placa: string): Promise<IDadosRelatorio | Error> {
    try {
      if (!placa) {
        return NotFoundException('Você deve informar a placa');
      }

      const response = await this.iDeviceAuditoriaRepositorio.pegarDadosTotaisRelatorio(placa);

      response.ultimaSincronizacao = new Date(await this.iLocalStorageConnection.getStorageDataString($LAST_SYNC_KEY));

      const responseRascunhos = await this.iDeviceRascunhoRepositorio.pegarTodosRascunhos();

      response.rascunhos = responseRascunhos.length > 0 ? responseRascunhos._array : [];

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
