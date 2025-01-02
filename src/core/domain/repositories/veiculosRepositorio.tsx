import { IApiResponse, IPaginationParams } from 'vision-common';

export interface IVeiculoRepositorio {
  pegarVeiculos: (params: IPaginationParams) => IApiResponse;
}
