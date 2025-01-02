import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../../../../entities/order';
import { IDeviceChecklistRepositorio } from '../../../../repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceRascunhoRepositorio } from '../../../../repositories/device/rascunhoRepositoiro';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export default class DeletarRascunhoColetaUseCase implements UseCase<IOrder, void | Error> {
  constructor(
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) {}

  async execute(rascunho: IOrder): Promise<void | Error> {
    try {
      const codigo =
        rascunho.codigoOS !== 0 ? `@VRRASCUNHO:${rascunho.codigoOS}` : `@VRRASCUNHO$NOVACOLETA:${rascunho.codigoCliente}`;

      await this.iDeviceRascunhoRepositorio.deletarRascunhoColeta(codigo);
      await this.iDeviceRascunhoRepositorio.deletarTodosRascunhosVazios();

      await this.iDeviceEnderecoRepositorio.deletarEndereco(codigo);
      await this.iDeviceMotivoRepositorio.deletarMotivo(codigo);
      await this.iDeviceImagemRepositorio.deletarImagem(codigo);
      await this.iDeviceResiduoRepositorio.deletarEquipamento(codigo);
      await this.iDeviceResiduoRepositorio.deletarEquipamento(`${codigo}$RETIRADO`);

      if (rascunho?.codigoOS) {
        await this.iDeviceChecklistRepositorio.deletarChecklist(rascunho.codigoOS);
      }

      await this.iDeviceChecklistRepositorio.deletarGruposChecklist(codigo);

      if (rascunho?.checklist && rascunho.checklist?.grupos?.length > 0) {
        for await (const grupo of rascunho.checklist.grupos) {
          if (grupo?.perguntas && grupo?.perguntas?.length > 0) {
            await this.iDeviceChecklistRepositorio.deletarPerguntasGruposChecklist(`${codigo}-${grupo.codigo}`);
            await this.iDeviceChecklistRepositorio.deletarPerguntasGruposChecklist(`${codigo}-${grupo.codigo}$RESPONDIDA`);
          }
        }
      }

      if (rascunho?.mtrs && rascunho.mtrs?.length > 0) {
        await this.iDeviceMtrRepositorio.deletarMtr(codigo);

        for await (const mtr of rascunho.mtrs) {
          await this.iDeviceMtrRepositorio.deletarEstadosMtr(mtr?.mtr && mtr.mtr.length > 0 ? mtr.mtr : mtr?.mtrCodBarras ?? '');
        }
      }

      if (rascunho?.residuos && rascunho.residuos?.length > 0) {
        await this.iDeviceResiduoRepositorio.deletarRascunhoResiduoSecundarioPesagem(codigo);

        for await (const residuo of rascunho.residuos) {
          residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

          if (residuo.fotos && residuo.fotos.length > 0) {
            await this.iDeviceImagemRepositorio.deletarImagem(`${codigo}-${residuo.codigo}`);
          }
        }

        await this.iDeviceResiduoRepositorio.deletarResiduo(codigo);
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
