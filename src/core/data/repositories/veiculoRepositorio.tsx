import { IPaginationParams } from 'vision-common';
import Axios from '../../axios';
import { IVeiculoRepositorio } from '../../domain/repositories/veiculosRepositorio';

export default class VeiculoRepositorio implements IVeiculoRepositorio {
  async pegarVeiculos(pagination: IPaginationParams) {
    const response = await Axios.get(
      `/listarVeiculos?pagina=${pagination.page}&pesquisa=${pagination.search}&linhas=${pagination.amount}`
    ).catch((e) => e.response);

    return response;
  }
}
