import { IApiResponse } from 'vision-common';

export interface IMtrRepositorio {
  pegarMtrs: (codigoOS: number) => IApiResponse;

  pegarMtrsGerados: (codigoVinculo: string | number) => IApiResponse;

  pegarEstadosMtr: () => IApiResponse;

  verificarRelacaoMtr: (codigoOS: number) => IApiResponse;
}
