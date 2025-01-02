import { IApiResponse, IPaginationParams } from 'vision-common';
import { IAtualizarLocalizacaoParams } from '../usecases/atualizarLocalizacaoClienteUseCase';
import { IChelInClienteParams } from '../usecases/checkInClienteUseCase';
import { ICheckOutClienteParams } from '../usecases/checkOutClienteUseCase';
import { IPegarObrasClientesParams } from '../usecases/pegarObrasClientesPaginadoUseCase';
import { IVerificarObrasContratoClienteOnlineUseCaseParams } from '../usecases/verificarObrasContratoClienteOnlineUseCase';

export interface IClienteRepositorio {
  pegarClientes: (pagination: IPaginationParams, regioes?: string) => IApiResponse;

  pegarCliente: (clienteID: number) => IApiResponse;

  pegarRegioes: (params: IPaginationParams) => IApiResponse;

  atualizarLocalizacao: (params: IAtualizarLocalizacaoParams) => IApiResponse;

  checkIn: (params: IChelInClienteParams) => IApiResponse;

  checkOut: (params: ICheckOutClienteParams) => IApiResponse;

  pegarObrasClientePaginado: (params: IVerificarObrasContratoClienteOnlineUseCaseParams) => IApiResponse;

  pegarObrasClientePorPlacaPaginado: (params: IPegarObrasClientesParams) => IApiResponse;
}
