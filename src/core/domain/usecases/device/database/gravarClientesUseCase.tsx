import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { ICliente } from '../../../entities/cliente';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export interface IGravarClientesParams {
  clientes: ICliente[];
  userID: number;
}

export default class GravarClientesUseCase implements UseCase<IGravarClientesParams, void | Error> {

  constructor(
    private readonly iClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iResiduoRepositorio: IDeviceResiduoRepositorio
  ) { }

  async execute(params: IGravarClientesParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksClientes = splitArrayIntoChunksOfLen(params.clientes, chunksLength);

      if (chunksClientes?.length > 0) {
        for await (const chunkClientes of chunksClientes) {
          let sqlClienteParams: string = '';
          let sqlEnderecoParams: string = '';
          let sqlContainerParams: string = '';

          for await (const cliente of chunkClientes) {
            sqlClienteParams += `${sqlClienteParams.length > 0 ? ',' : ''}(
                  ${cliente?.codigo ?? 0},
                  ${params.userID},
                  "${replaceString(cliente?.nomeFantasia ?? '')}",
                  "${replaceString(cliente?.razaoSocial ?? '')}",
                  "${replaceString(cliente?.cpfcnpj ?? '')}",
                  "${replaceString(cliente?.inscricaoEstadual ?? '')}",
                  "${replaceString(cliente?.inscricaoMunicipal ?? '')}",
                  "${replaceString(cliente?.telefone ?? '')}",
                  "${replaceString(cliente?.celular ?? '')}"
                )`;

            if (cliente?.codigo && cliente?.endereco) {
              sqlEnderecoParams += `${sqlEnderecoParams.length > 0 ? ',' : ''}(
                  ${params.userID},
                  "${cliente?.codigo ?? 0}",
                  "${replaceString(cliente.endereco?.rua ?? '')}",
                  "${replaceString(cliente.endereco?.bairro ?? '')}",
                  ${Number(cliente.endereco?.numero ?? 0)},
                  "${replaceString(cliente.endereco?.letra ?? '')}",
                  "${replaceString(cliente.endereco?.complemento ?? '')}",
                  "${replaceString(cliente.endereco?.cidade ?? '')}",
                  "${replaceString(cliente.endereco?.uf ?? '')}",
                  "${replaceString(String(cliente.endereco?.latLng && cliente.endereco.latLng?.latitude ? cliente.endereco?.latLng?.latitude : ''))}",
                  "${replaceString(String(cliente.endereco?.latLng && cliente.endereco.latLng?.longitude ? cliente.endereco?.latLng?.longitude : ''))}"
                )`;
            }

            if (cliente?.containers && cliente.containers?.length > 0) {
              for await (const container of cliente.containers) {
                sqlContainerParams += `${sqlContainerParams.length > 0 ? ',' : ''}(
                    ${params.userID},
                    ${container?.codigoOS ?? 0},
                    ${container?.codigoCliente ?? 0},
                    ${container?.codigoContainer ?? 0},
                    ${container?.codigoMovimentacao ?? 0},
                    "${replaceString(container?.descricaoContainer ?? '')}",
                    "${replaceString(String(container?.dataColocacao ?? ''))}",
                    "${replaceString(String(container?.dataRetirada ?? ''))}"
                  )`;
              }
            }
          }

          // INSERE O CLIENTE
          if (sqlClienteParams && sqlClienteParams?.length > 0)
            await this.iClienteRepositorio.inserirClientesSincronizacao(sqlClienteParams);

          // ENDEREÇO CLIENTE
          if (sqlEnderecoParams && sqlEnderecoParams?.length > 0)
            await this.iEnderecoRepositorio.inserirEnderecosSincronizacao(sqlEnderecoParams);

          // CONTAINERS CLIENTE
          if (sqlContainerParams && sqlContainerParams?.length > 0)
            await this.iResiduoRepositorio.inserirContainersSincronizacao(sqlContainerParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
