import { IOrder } from '../../../../entities/order';
import { setEndereco } from '../../../../entities/endereco';
import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceRascunhoRepositorio } from '../../../../repositories/device/rascunhoRepositoiro';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class PegarRascunhosColetasUseCase implements UseCase<IPaginationParams, IPaginationResponse<IOrder> | Error> {
  constructor(
    private readonly iRascunhoRepositorio: IDeviceRascunhoRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio,
  ) {}

  async execute(params: IPaginationParams): Promise<IPaginationResponse<IOrder> | Error> {
    try {
      let totalPaginas = 0;
      const rascunhosList: IOrder[] = [];

      const totalLinhas = await this.iRascunhoRepositorio.pegarTotalLinhas();
      const response = await this.iRascunhoRepositorio.pegarRascunhos(params);

      if (response.length > 0) {
        if (totalLinhas && totalLinhas !== 0) {
          totalPaginas = Math.ceil(totalLinhas / params.amount);

          for await (const rascunho of response._array) {
            const codigo =
              rascunho.codigoOS !== 0 ? `@VRRASCUNHO:${rascunho.codigoOS}` : `@VRRASCUNHO$NOVACOLETA:${rascunho.codigoCliente}`;

            const enderecoResponse = await this.iEnderecoRepositorio.pegarEndereco(codigo);

            if (enderecoResponse) {
              rascunho.enderecoOS = setEndereco(enderecoResponse);
            }

            rascunhosList.push(rascunho);
          }
        }
      }

      return {
        ...params,
        items: rascunhosList ?? [],
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0,
      };
    } catch (e) {
      return ApiException(e);
    }
  }
}
