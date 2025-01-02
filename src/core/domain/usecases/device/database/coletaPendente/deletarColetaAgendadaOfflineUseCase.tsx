import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../../../../entities/order';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export default class DeletarColetaAgendadaOfflineUseCase implements UseCase<IOrder, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) {}

  async execute(coleta: IOrder): Promise<void | Error> {
    try {
      const codigo = `@VRCOLETAAGENDADAPENDENTE:${coleta.codigoOS}`;
      const codigoRetirado = `@VRCOLETAAGENDADAPENDENTE$RETIRADO:${coleta.codigoOS}`;

      if (coleta?.codigoOS) {
        await this.iDeviceOrdemServicoRepositorio.deletarColetaAgendadaPendente(coleta.codigoOS);
      }

      await this.iDeviceMotivoRepositorio.deletarMotivo(codigo);
      await this.iDeviceMotivoRepositorio.deletarMotivoRecusaAssinatura(codigo);
      await this.iDeviceEnderecoRepositorio.deletarEndereco(codigo);
      await this.iDeviceImagemRepositoio.deletarImagem(codigo);
      await this.iDeviceResiduoRepositorio.deletarEquipamento(codigo);
      await this.iDeviceResiduoRepositorio.deletarEquipamento(codigoRetirado);
      await this.iDeviceResiduoRepositorio.deletarResiduo(codigo);
      await this.iDeviceMtrDeviceRepositorio.deletarMtr(codigo);
      await this.iDeviceMtrDeviceRepositorio.deletarEstadosMtr(codigo);

      if (coleta.residuos && coleta.residuos.length > 0) {
        await this.iDeviceResiduoRepositorio.deletarRascunhoResiduoSecundarioPesagem(codigo);

        for await (const residuo of coleta.residuos) {
          if (residuo.codigo) {
            residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

            await this.iDeviceImagemRepositoio.deletarImagem(`${codigo}-${residuo.id}`);
          }
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
