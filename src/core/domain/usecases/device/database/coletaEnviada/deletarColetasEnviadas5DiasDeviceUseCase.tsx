import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';

export default class DeletarColetasEnviadas5DiasDeviceUseCase implements UseCase<void, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
    private readonly iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio,
  ) { }

  async execute(): Promise<void | Error> {
    try {
      const coletas = await this.iDeviceOrdemServicoRepositorio.pegarColetasEnviadas5Dias();

      if (coletas.length > 0) {
        for await (const coleta of coletas._array) {
          const codigoRetirado =
            coleta.codigoOS !== 0
              ? `@VRCOLETAENVIADA:${coleta.codigoOS}$RETIRADO`
              : `@VRCOLETAENVIADA$NOVACOLETA:${coleta.codigoCliente}$RETIRADO`;

          const residuosOS = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(coleta?.codigoVinculo ?? '');

          await this.iDeviceResiduoRepositorio.deletarResiduo(coleta?.codigoVinculo ?? '');
          await this.iDeviceOrdemServicoRepositorio.deletarColetaEnviada(coleta?.codigoVinculo ?? '');
          await this.iDeviceEnderecoRepositorio.deletarEndereco(coleta?.codigoVinculo ?? '');
          await this.iDeviceImagemRepositoio.deletarImagem(coleta?.codigoVinculo ?? '');
          await this.iDeviceResiduoRepositorio.deletarEquipamento(coleta?.codigoVinculo ?? '');
          await this.iDeviceResiduoRepositorio.deletarEquipamento(codigoRetirado);
          await this.iDeviceMotivoRepositorio.deletarMotivo(coleta?.codigoVinculo ?? '');
          await this.iDeviceMotivoRepositorio.deletarMotivoRecusaAssinatura(coleta?.codigoVinculo ?? '');
          await this.iDeviceMtrDeviceRepositorio.deletarMtr(coleta?.codigoVinculo ?? '');
          await this.iDeviceMtrDeviceRepositorio.deletarEstadosMtr(coleta?.codigoVinculo ?? '');

          console.log('DELETA 5 DIAS: ', coleta.codigoVinculo)
          await this.iDeviceResiduoRepositorio.deletarResiduoSecundarioPesagem(coleta?.codigoVinculo ?? '');

          if (residuosOS && residuosOS.length > 0) {
            for await (const residuo of residuosOS._array) {
              if (residuo.codigo) {
                residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

                await this.iDeviceImagemRepositoio.deletarImagem(`${coleta?.codigoVinculo ?? ''}-${residuo.id}`);
              }
            }
          }
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
