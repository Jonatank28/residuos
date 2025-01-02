import { ApiException } from 'vision-common';
import { IFiltro } from '../../../../entities/filtro';
import { IOrder } from '../../../../entities/order';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';

export interface IPegarColetasEnviadasParams {
  pesquisa?: string;
  filtros?: IFiltro;
}

export default class PegarColetasEnviadasUseCase implements UseCase<IPegarColetasEnviadasParams, IOrder[] | Error> {
  constructor(
    private readonly iOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio,
  ) {}

  async execute(params: IPegarColetasEnviadasParams): Promise<IOrder[] | Error> {
    try {
      const coletas: IOrder[] = [];
      const response = await this.iOrdemServicoRepositorio.pegarColetasEnviadas(params?.pesquisa ?? '', params?.filtros ?? {});

      if (response.length > 0) {
        for await (const coleta of response._array) {
          const codigo = coleta.codigoOS !== 0 ? `@VRCOLETAENVIADA:${coleta.codigoOS}` : coleta?.codigoVinculo ?? '';

          const endereco = await this.iEnderecoRepositorio.pegarEndereco(codigo);

          if (endereco) {
            coleta.enderecoOS = endereco;
          }

          coletas.push(coleta);
        }
      }

      return coletas;
    } catch (e) {
      return ApiException(e);
    }
  }
}
