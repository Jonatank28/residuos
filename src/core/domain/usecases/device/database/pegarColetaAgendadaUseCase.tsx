import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { setEndereco } from '../../../entities/endereco';
import { IOrder } from '../../../entities/order';
import { IDeviceChecklistRepositorio } from '../../../repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export default class PegarColetaAgendadaUseCase implements UseCase<number, IOrder | Error> {

  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio
  ) { }

  async execute(codigoOS: number): Promise<IOrder | Error> {
    try {
      let coleta: IOrder = {};
      const codigo = `@VRCOLETAAGENDADA:${codigoOS}`;
      const response = await this.iDeviceOrdemServicoRepositorio.pegarColetaAgendada(codigoOS);

      if (response && response?.codigoOS) {
        coleta = response;

        const endereco = await this.iDeviceEnderecoRepositorio.pegarEndereco(codigo);
        const imagensOS = await this.iDeviceImagemRepositoio.pegarImagens(codigo);
        const equipamentosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigo);
        const residuosOS = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);
        const mtrsOS = await this.iDeviceMtrRepositorio.pegarMtrs(codigo);
        const motivoOS = await this.iDeviceMotivoRepositorio.pegarMotivo(codigo);
        const motivoRecusaAssinaturaOS = await this.iDeviceMotivoRepositorio.pegarMotivoRecusaAssinatura(codigo);

        const checklistOS = await this.iDeviceChecklistRepositorio.pegarChecklist(codigoOS);

        if (checklistOS && checklistOS?.codigo) {
          coleta.checklist = checklistOS;

          const gruposChecklist = await this.iDeviceChecklistRepositorio.pegarGruposChecklist(codigo);

          if (gruposChecklist.length > 0) {
            for await (const grupo of gruposChecklist._array) {
              const perguntas = await this.iDeviceChecklistRepositorio.pegarPerguntasGrupoChecklist(
                `${codigo}-${grupo.codigo}`
              );

              if (perguntas.length > 0) grupo.perguntas = perguntas._array;
            }

            coleta.checklist.grupos = gruposChecklist._array;
          }
        }

        if (endereco) {
          coleta.enderecoOS = setEndereco(endereco);
        }

        if (imagensOS.length > 0) {
          coleta.fotos = imagensOS._array;
        }

        if (equipamentosOS.length > 0) {
          coleta.equipamentos = equipamentosOS._array;
        }

        if (residuosOS.length > 0) {
          coleta.residuos = residuosOS._array;

          for await (const residuo of coleta.residuos) {
            residuo.preCadastroReferencia = Boolean(residuo?.preCadastroReferencia);
            residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

            if (residuo.codigo) {
              if (residuo?.xImobilizadoGenerico && residuo?.codigoIDResiduoGenerico) {
                const residuosSecundarios = await this.iDeviceResiduoRepositorio.pegarResiduosSecundariosPesagem(
                  `@VRCOLETAAGENDADA:${coleta.codigoOS}-${residuo.codigoIDResiduoGenerico}`,
                );

                if (residuosSecundarios && residuosSecundarios._array) {
                  residuo.residuosSecundarios = residuosSecundarios._array;
                }
              }

              const imagensResiduo = await this.iDeviceImagemRepositoio.pegarImagens(
                `@VRCOLETAAGENDADA:${coleta.codigoOS}-${residuo.codigo}`
              );

              if (imagensResiduo.length > 0) residuo.fotos = imagensResiduo._array;
            }
          }
        }

        if (mtrsOS.length > 0) {
          coleta.mtrs = mtrsOS._array;

          for await (const mtr of coleta.mtrs) {
            if (!mtr.hasSinir && mtr?.codigoEstado) {
              const responseEstadoMtr = await this.iDeviceMtrRepositorio.pegarEstadoMtr(mtr.codigoEstado, codigo);

              if (responseEstadoMtr && responseEstadoMtr?.codigo) {
                mtr.estado = responseEstadoMtr;
              }
            }
          }
        }

        if (motivoOS && motivoOS?.codigo) {
          coleta.motivo = motivoOS;
        }

        if (motivoRecusaAssinaturaOS && motivoRecusaAssinaturaOS?.motivo) {
          coleta.motivoRecusaAssinatura = motivoRecusaAssinaturaOS;
        }
      }

      return coleta;
    } catch (e) {
      return ApiException(e);
    }
  };
}
