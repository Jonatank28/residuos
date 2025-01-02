import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../../../entities/order';
import { IDeviceChecklistRepositorio } from '../../../repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';
import { auditar } from '../../../../auditoriaHelper';

export default class DeletarColetaAgendadaUseCase implements UseCase<IOrder, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) {}

  async execute(coleta: IOrder): Promise<void | Error> {
    try {
      if (coleta?.codigoOS) {
        const codigo = `@VRCOLETAAGENDADA:${coleta.codigoOS}`;

        const response = await this.iDeviceOrdemServicoRepositorio.deletarColetaAgendada(coleta.codigoOS);

        if (response !== 0) {
          await this.iDeviceEnderecoRepositorio.deletarEndereco(codigo);
          await this.iDeviceImagemRepositoio.deletarImagem(codigo);
          await this.iDeviceMtrRepositorio.deletarMtr(codigo);
          await this.iDeviceMtrRepositorio.deletarEstadosMtr(codigo);
          await this.iDeviceMotivoRepositorio.deletarMotivoRecusaAssinatura(codigo);
          await this.iDeviceMotivoRepositorio.deletarMotivo(codigo);

          await this.iDeviceChecklistRepositorio.deletarChecklist(coleta.codigoOS);

          if (coleta?.checklist && coleta.checklist?.codigo) {
            await this.iDeviceChecklistRepositorio.deletarGruposChecklist(coleta.checklist.codigo);
          }

          if (coleta?.checklist && coleta.checklist?.grupos?.length > 0) {
            for await (const grupo of coleta.checklist.grupos) {
              await this.iDeviceChecklistRepositorio.deletarGruposChecklist(codigo);

              if (grupo?.perguntas && grupo.perguntas.length > 0) {
                await this.iDeviceChecklistRepositorio.deletarPerguntasGruposChecklist(`${codigo}-${grupo.codigo}`);
              }
            }
          }

          const residuos = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);

          if (residuos.length > 0) {
            for await (const residuo of residuos._array) {
              residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

              // Deleta resíduos pesagem
              if (residuo?.xImobilizadoGenerico && residuo?.codigoIDResiduoGenerico) {
                const r = await this.iDeviceResiduoRepositorio.deletarResiduoSecundarioPesagem(
                  String(residuo.codigoIDResiduoGenerico),
                );
              }

              await this.iDeviceImagemRepositoio.deletarImagem(`@VRCOLETAAGENDADA:${coleta.codigoOS}-${residuo.codigo}`);
              if (residuo.imobilizado?.codigo) {
                await this.iDeviceResiduoRepositorio.vincularImobilizadoNoResiduo({
                  codigoVinculo: `@IMOBILIZADO_RESIDUO:${residuo.codigo}-OS:${coleta.codigoOS}`,
                  imobilizado: residuo.imobilizado
                });
              }
            }
          }

          await this.iDeviceResiduoRepositorio.deletarResiduo(codigo);
          await this.iDeviceResiduoRepositorio.deletarEquipamento(codigo);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
