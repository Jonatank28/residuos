import { AsyncAxiosConnection, IPaginationParams } from 'vision-common';
import axiosClient from '../../../core/axios';
import ClienteRepositorio from '../../../core/data/repositories/clienteRepositorio';
import { IClienteRepositorio } from '../../../core/domain/repositories/clienteRepositorio';
import PegarRegioesUseCase from '../../../core/domain/usecases/pegarRegioesUseCase';

export default class RegioesPresenter {
  private readonly iClienteRepositorio: IClienteRepositorio;

  private readonly pegarRegioesUseCase: PegarRegioesUseCase;

  constructor() {
    this.iClienteRepositorio = new ClienteRepositorio(new AsyncAxiosConnection(axiosClient));

    this.pegarRegioesUseCase = new PegarRegioesUseCase(this.iClienteRepositorio);
  }

  pegarRegioes = async (params: IPaginationParams) => this.pegarRegioesUseCase.execute(params);
}
