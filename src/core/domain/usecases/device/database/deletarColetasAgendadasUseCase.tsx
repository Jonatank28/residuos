import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceChecklistRepositorio } from '../../../repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class DeletarColetasAgendadasUseCase implements UseCase<void, void | Error> {

  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio
  ) { }

  async execute(): Promise<void | Error> {
    try {
      const response = await this.iDeviceOrdemServicoRepositorio.pegarTodasColetasAgendadas();

      if (response.length > 0) {
        for await (const coleta of response._array) {
          if (coleta?.codigoOS) {
            const codigo = `@VRCOLETAAGENDADA:${coleta.codigoOS}`;

            await this.iDeviceOrdemServicoRepositorio.deletarColetaAgendada(coleta.codigoOS);
            await this.iDeviceChecklistRepositorio.deletarChecklist(coleta.codigoOS);
            await this.iDeviceEnderecoRepositorio.deletarEndereco(codigo);
            await this.iDeviceImagemRepositoio.deletarImagem(codigo);
            await this.iDeviceMtrRepositorio.deletarMtr(codigo);
            await this.iDeviceMtrRepositorio.deletarEstadosMtr(codigo);
            await this.iDeviceMotivoRepositorio.deletarMotivoRecusaAssinatura(codigo);
            await this.iDeviceMotivoRepositorio.deletarMotivo(codigo);

            const residuos = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);

            if (residuos.length > 0) {
              for await (const residuo of residuos._array) {
                await this.iDeviceImagemRepositoio.deletarImagem(`@VRCOLETAAGENDADA:${coleta.codigoOS}-${residuo.codigo}`);
              }
            }

            await this.iDeviceResiduoRepositorio.deletarResiduo(codigo);
            await this.iDeviceResiduoRepositorio.deletarEquipamento(codigo);
          }
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}
