import { ApiException, replaceString, splitArrayIntoChunksOfLen } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IObra } from '../../../entities/obra';
import { IDeviceClienteRepositorio } from '../../../repositories/device/clienteRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';

export interface IGravarObrasClienteParams {
  obras: IObra[];
  userID: number;
}

export default class GravarObraClienteUseCase implements UseCase<IGravarObrasClienteParams, void | Error> {

  constructor(
    private readonly iClienteRepositorio: IDeviceClienteRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio
  ) { }

  async execute(params: IGravarObrasClienteParams): Promise<void | Error> {
    try {
      const chunksLength = 999;
      const chunksObrasClientes = splitArrayIntoChunksOfLen(params.obras, chunksLength);

      if (chunksObrasClientes?.length > 0) {
        for await (const chunkObrasClientes of chunksObrasClientes) {
          let sqlObraClienteParams: string = '';
          let sqlObraEnderecoParams: string = '';

          for await (const obraCliente of chunkObrasClientes) {
            sqlObraClienteParams += `${sqlObraClienteParams.length > 0 ? ',' : ''}(
                  ${obraCliente?.codigo ?? 0},
                  ${params.userID},
                  ${obraCliente?.codigoCliente ?? 0},
                  ${obraCliente?.codigoContrato ?? 0},
                  "${replaceString(obraCliente?.descricao ?? '')}",
                  ${obraCliente?.codigoDestinador ?? 0},
                  ${obraCliente?.codigoEmpresa ?? 0}
                )`;

            if (obraCliente?.codigo && obraCliente?.endereco) {
              const codigo = `@VROBRACLIENTE:${obraCliente?.codigo}-${obraCliente?.codigoCliente}`;

              sqlObraEnderecoParams += `${sqlObraEnderecoParams?.length > 0 ? ',' : ''}(
                  ${params.userID},
                  "${replaceString(codigo)}",
                  "${replaceString(obraCliente.endereco?.rua ?? '')}",
                  "${replaceString(obraCliente.endereco?.bairro ?? '')}",
                  ${obraCliente.endereco?.numero ?? 0},
                  "${replaceString(obraCliente.endereco?.letra ?? '')}",
                  "${replaceString(obraCliente.endereco?.complemento ?? '')}",
                  "${replaceString(obraCliente.endereco?.cidade ?? '')}",
                  "${replaceString(obraCliente.endereco?.uf ?? '')}",
                  "${replaceString(String(obraCliente.endereco?.latLng && obraCliente.endereco.latLng?.latitude ? obraCliente.endereco?.latLng?.latitude : ''))}",
                  "${replaceString(String(obraCliente.endereco?.latLng && obraCliente.endereco.latLng?.longitude ? obraCliente.endereco?.latLng?.longitude : ''))}"
                )`;
            }
          }

          // INSERE A OBRA
          if (sqlObraClienteParams && sqlObraClienteParams?.length > 0)
            await this.iClienteRepositorio.inserirObrasClientesSincronizacao(sqlObraClienteParams);

          // ENDEREÇO OBRA
          if (sqlObraEnderecoParams && sqlObraEnderecoParams?.length > 0)
            await this.iEnderecoRepositorio.inserirEnderecosSincronizacao(sqlObraEnderecoParams);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
