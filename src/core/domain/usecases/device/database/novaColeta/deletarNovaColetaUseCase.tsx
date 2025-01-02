import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';

export default class DeletarNovaColetaUseCase implements UseCase<IOrder, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) { }

  async execute(coleta: IOrder): Promise<void | Error> {
    try {
      await this.iDeviceOrdemServicoRepositorio.deletarNovaColeta(coleta?.codigoVinculo ?? '');
      await this.iDeviceMotivoRepositorio.deletarMotivo(coleta?.codigoVinculo ?? '');
      await this.iDeviceMotivoRepositorio.deletarMotivoRecusaAssinatura(coleta?.codigoVinculo ?? '');
      await this.iDeviceEnderecoRepositorio.deletarEndereco(coleta?.codigoVinculo ?? '');
      await this.iDeviceImagemRepositoio.deletarImagem(coleta?.codigoVinculo ?? '');
      await this.iDeviceResiduoRepositorio.deletarEquipamento(coleta?.codigoVinculo ?? '');
      await this.iDeviceResiduoRepositorio.deletarEquipamento(`${coleta?.codigoVinculo ?? ''}$RETIRADO`);
      await this.iDeviceMtrRepositorio.deletarMtr(coleta?.codigoVinculo ?? '');
      await this.iDeviceMtrRepositorio.deletarEstadosMtr(coleta?.codigoVinculo ?? '');
      await this.iDeviceResiduoRepositorio.deletarResiduo(coleta?.codigoVinculo ?? '');

      if (coleta?.residuos && coleta.residuos?.length > 0) {
        for await (const residuo of coleta.residuos) {
          await this.iDeviceResiduoRepositorio.deletarRascunhoResiduoSecundarioPesagem(coleta?.codigoVinculo ?? '');

          residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

          await this.iDeviceImagemRepositoio.deletarImagem(residuo?.codigoHashResiduo ?? '');
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
