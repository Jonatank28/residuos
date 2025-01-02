import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../../../../entities/order';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export default class DeletarColetaEnviadaUseCase implements UseCase<IOrder, boolean | Error> {
  constructor(
    private readonly iOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iResiduoRepositorio: IDeviceResiduoRepositorio,
  ) { }

  async execute(coleta: IOrder): Promise<boolean | Error> {
    try {
      const codigo =
        coleta.codigoOS !== 0 ? `@VRCOLETAENVIADA:${coleta.codigoOS}` : `@VRCOLETAENVIADA$NOVACOLETA:${coleta.codigoCliente}`;

      const codigoRetirado =
        coleta.codigoOS !== 0
          ? `@VRCOLETAENVIADA$RETIRADO:${coleta.codigoOS}`
          : `@VRCOLETAENVIADA$NOVACOLETA$RETIRADO:${coleta.codigoCliente}`;

      const response = await this.iOrdemServicoRepositorio.deletarColetaEnviada(codigo);
      await this.iEnderecoRepositorio.deletarEndereco(codigo);
      await this.iImagemRepositoio.deletarImagem(codigo);
      await this.iResiduoRepositorio.deletarEquipamento(codigo);
      await this.iResiduoRepositorio.deletarEquipamento(codigoRetirado);
      await this.iResiduoRepositorio.deletarResiduo(codigo);
      await this.iResiduoRepositorio.deletarRascunhoResiduoSecundarioPesagem(codigo);

      if (coleta.residuos && coleta.residuos.length > 0) {
        for await (const residuo of coleta.residuos) {
          if (residuo.codigo) {
            residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

            await this.iImagemRepositoio.deletarImagem(`${codigo}-${residuo.id}`);
          }
        }
      }

      return response !== 0;
    } catch (e) {
      return ApiException(e);
    }
  }
}
