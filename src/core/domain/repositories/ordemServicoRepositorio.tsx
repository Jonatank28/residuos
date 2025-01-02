import { IApiResponse } from 'vision-common';
import { IEnviarColetaParams } from '../usecases/enviarColetaUseCase';
import { IInserirOSParams } from '../usecases/inserirOSManualUseCase';
import { IPegarColetasAgendadasParams } from '../usecases/pegarColetasAgendadasUseCase';

export interface IOrdemServicoRepositorio {
  pegarColetasAgendadas: (params: IPegarColetasAgendadasParams) => IApiResponse;

  pegarTodasColetasAgendadas: () => IApiResponse;

  pegarColetaAgendada: (codigoOS: number) => IApiResponse;

  pegarMotivos: () => IApiResponse;

  enviarColeta: (params: IEnviarColetaParams) => IApiResponse;

  inserirOSManual: (params: IInserirOSParams) => IApiResponse;

  pegarRotas: (placa: string) => IApiResponse;
}
