import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { setEndereco } from '../../../../entities/endereco';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceChecklistRepositorio } from '../../../../repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceRascunhoRepositorio } from '../../../../repositories/device/rascunhoRepositoiro';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';
import { UseCase } from 'vision-common/src/app/hooks/usecase';

export default class PegarRascunhoColetaUseCase implements UseCase<IOrder, IOrder | Error> {
  constructor(
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceChecklistRepositorio: IDeviceChecklistRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) { }

  async execute(rascunho: IOrder): Promise<IOrder | Error> {
    try {
      let coleta: IOrder = {};

      const codigo =
        rascunho?.codigoOS && rascunho?.codigoOS !== 0
          ? `@VRRASCUNHO:${rascunho.codigoOS}`
          : `@VRRASCUNHO$NOVACOLETA:${rascunho.codigoCliente}`;

      const response = await this.iDeviceRascunhoRepositorio.pegarRascunhoColeta(codigo);

      if (response) {
        coleta = response;

        const endereco = await this.iDeviceEnderecoRepositorio.pegarEndereco(codigo);
        const imagensOS = await this.iDeviceImagemRepositorio.pegarImagens(codigo);
        const motivo = await this.iDeviceMotivoRepositorio.pegarMotivo(codigo);
        const residuos = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);
        const equipamentos = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigo);
        const equipamentosRetirados = await this.iDeviceResiduoRepositorio.pegarEquipamentos(`${codigo}$RETIRADO`);
        const mtrsOS = await this.iDeviceMtrRepositorio.pegarMtrs(codigo);

        if (rascunho?.codigoOS) {
          const checklistOS = await this.iDeviceChecklistRepositorio.pegarChecklist(rascunho.codigoOS);

          if (checklistOS && checklistOS?.codigo) {
            coleta.checklist = checklistOS;

            const gruposChecklist = await this.iDeviceChecklistRepositorio.pegarGruposChecklist(codigo);

            if (gruposChecklist.length > 0) {
              for await (const grupo of gruposChecklist._array) {
                const perguntas = await this.iDeviceChecklistRepositorio.pegarPerguntasGrupoChecklist(
                  `${codigo}-${grupo.codigo}`,
                );
                const perguntasResResponse = await this.iDeviceChecklistRepositorio.pegarPerguntasGrupoChecklist(
                  `${codigo}-${grupo.codigo}$RESPONDIDA`,
                );

                if (perguntas.length > 0) grupo.perguntas = perguntas._array;
                if (perguntasResResponse.length > 0) coleta.perguntasRespondidas = perguntasResResponse._array;
              }

              coleta.checklist.grupos = gruposChecklist._array;
            }
          }
        }

        if (imagensOS.length > 0) coleta.fotos = imagensOS._array;
        if (endereco) coleta.enderecoOS = setEndereco(endereco);
        if (motivo && motivo?.codigo) coleta.motivo = motivo;

        if (residuos.length > 0) {
          for await (const residuo of residuos._array) {
            if (residuo.codigo) {
              residuo.quantidade = String(residuo.quantidade);
              residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

              if (residuo?.xImobilizadoGenerico && residuo?.codigo) {
                const residuosSecundarios = await this.iDeviceResiduoRepositorio.pegarResiduosSecundariosPesagem(
                  `${codigo}-${residuo.id}`,
                );

                if (residuosSecundarios && residuosSecundarios._array) {
                  residuo.residuosSecundarios = residuosSecundarios._array;
                }
              }

              const codigoVinculo = `@IMOBILIZADO_RESIDUO:${
                residuo?.codigo
              }-${
                rascunho.codigoOS?'OS':'CLIENTE'
              }:${
                rascunho.codigoOS? rascunho.codigoOS: rascunho.codigoCliente
              }`;

              const imobilizado = await this.iDeviceResiduoRepositorio
                .pegarImobilizadoDoResiduoVinculo(codigoVinculo)

              residuo.imobilizado = imobilizado._array?.[0];


              const imagensResiduo = await this.iDeviceImagemRepositorio.pegarImagens(`${codigo}-${residuo.id}`);
              residuo.fotos = imagensResiduo._array;
            }
          }

          coleta.residuos = residuos._array;
        }

        if (equipamentos.length > 0) {
          coleta.equipamentos = equipamentos._array;
        }

        if (equipamentosRetirados.length > 0) {
          coleta.equipamentosRetirados = equipamentosRetirados._array;
        }

        if (mtrsOS.length > 0) {
          coleta.mtrs = mtrsOS._array;
          for await (const mtr of coleta.mtrs) {
            if (!mtr.hasSinir && mtr?.codigoEstado) {
              const estadoMtr = await this.iDeviceMtrRepositorio.pegarEstadoMtr(
                mtr.codigoEstado,
                mtr?.mtr && mtr.mtr.length > 0 ? mtr.mtr : mtr?.mtrCodBarras ?? '',
              );

              if (estadoMtr && estadoMtr?.codigo) mtr.estado = estadoMtr;
            }
          }
        }
      }

      return coleta;
    } catch (e) {
      return ApiException(e);
    }
  }
}
