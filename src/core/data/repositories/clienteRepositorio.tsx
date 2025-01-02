import { AsyncAxiosConnection, IPaginationParams } from 'vision-common';
import { IClienteRepositorio } from '../../domain/repositories/clienteRepositorio';
import { IAtualizarLocalizacaoParams } from '../../domain/usecases/atualizarLocalizacaoClienteUseCase';
import { IChelInClienteParams } from '../../domain/usecases/checkInClienteUseCase';
import { ICheckOutClienteParams } from '../../domain/usecases/checkOutClienteUseCase';
import { IPegarObrasClientesParams } from '../../domain/usecases/pegarObrasClientesPaginadoUseCase';
import { IVerificarObrasContratoClienteOnlineUseCaseParams } from '../../domain/usecases/verificarObrasContratoClienteOnlineUseCase';

export default class ClienteRepositorio implements IClienteRepositorio {

  constructor(private readonly _conn: AsyncAxiosConnection) { }

  async pegarClientes(pagination: IPaginationParams, regioes?: string) {
    return this._conn.get(
      `/listarClientes?pagina=${pagination.page}&pesquisa=${pagination.search}&linhas=${pagination.amount}${regioes ?? ''}`
    );
  }

  async pegarCliente(clienteID: number) {
    return this._conn.get(
      `/listarCliente?clienteID=${clienteID ?? 0}`
    );
  }

  async pegarRegioes(params: IPaginationParams) {
    return this._conn.get(
      `/listarRegioes?pagina=${params.page}&pesquisa=${params.search}&linhas=${params.amount}`
    );
  }

  async atualizarLocalizacao(params: IAtualizarLocalizacaoParams) {
    return this._conn.post(
      '/atualizarLocalizacaoCliente',
      {
        clienteID: params.clienteID,
        latLng: {
          latitude: params.location.latitude,
          longitude: params.location.longitude
        }
      }
    );
  }

  async checkIn(params: IChelInClienteParams) {
    return this._conn.post(
      '/checkIn',
      {
        clienteID: params.clienteID,
        latLng: {
          latitude: params.location.latitude,
          longitude: params.location.longitude
        },
        ordemServico: params?.codigoOs ?? 0
      }
    );
  }

  async checkOut(params: ICheckOutClienteParams) {
    return this._conn.post(
      '/checkOut',
      {
        clienteID: params.clienteID,
        latlng: {
          latitude: params.location.latitude,
          longitude: params.location.longitude
        }
      }
    );
  }

  async pegarObrasClientePaginado(params: IVerificarObrasContratoClienteOnlineUseCaseParams) {
    return this._conn.get(
      `/listarObrasPaginado?codigoCliente=${params.clienteID ?? 0}&pagina=${params.pagination.page}&pesquisa=${params.pagination.search}&linhas=${params.pagination.amount}`
    );
  }

  async pegarObrasClientePorPlacaPaginado(params: IPegarObrasClientesParams) {
    return this._conn.get(
      `/listarObrasPaginadoPorPlaca?pagina=${params.pagination.page}&pesquisa=${params.pagination.search}&linhas=${params.pagination.amount}&clienteID=${params.clienteID}&placa=${params.placa}`
    );
  }
}
