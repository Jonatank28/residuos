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

export default class GravarRascunhoColetaUseCase implements UseCase<IOrder, void | Error> {
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
        rascunho?.codigoOS && rascunho?.codigoOS !== 0
          ? `@VRRASCUNHO:${rascunho.codigoOS}`
          : `@VRRASCUNHO$NOVACOLETA:${rascunho.codigoCliente}`;

      await this.iDeviceRascunhoRepositorio.inserirRascunho(rascunho, codigo);

      if (rascunho?.checklist?.codigo) {
        await this.iDeviceChecklistRepositorio.inserirChecklist(rascunho.checklist, rascunho?.codigoOS ?? 0);

        if (rascunho?.checklist?.grupos?.length > 0) {
          for await (const grupo of rascunho.checklist.grupos) {
            await this.iDeviceChecklistRepositorio.inserirGrupoChecklist(grupo, codigo);

            if (grupo?.perguntas && grupo.perguntas?.length > 0) {
              for await (const pergunta of grupo.perguntas) {
                await this.iDeviceChecklistRepositorio.inserirPerguntaGrupoChecklist(pergunta, `${codigo}-${grupo.codigo}`);
              }
            }
          }
        }
      }

      if (rascunho?.enderecoOS?.bairro || rascunho?.enderecoOS?.rua) {
        await this.iDeviceEnderecoRepositorio.inserirEndereco(codigo, rascunho.enderecoOS);
      }

      if (rascunho?.motivo?.codigo) {
        await this.iDeviceMotivoRepositorio.inserirMotivo(rascunho.motivo, codigo);
      }

      if (rascunho?.fotos && rascunho.fotos?.length > 0) {
        for await (const foto of rascunho.fotos) {
          foto.nome = `Foto do rascunho ${rascunho.codigoOS ?? ''}`;
          foto.origem = 'OS';

          const res = await this.iDeviceImagemRepositorio.inserirImagem(foto, codigo);
          if(typeof res === 'number') foto.id = res;
        }
      }

      if (rascunho?.residuos && rascunho.residuos?.length > 0) {
        for await (const residuo of rascunho.residuos) {
          residuo.xImobilizadoGenerico = Boolean(residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0);
          const id = await this.iDeviceResiduoRepositorio.inserirResiduo(residuo, codigo);

          // Insere resíduos secundários
          if (residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0) {
            for await (const residuoSecundario of residuo.residuosSecundarios) {
              residuoSecundario.xImobilizadoGenerico = false;

              await this.iDeviceResiduoRepositorio.inserirResiduoPesagem(residuoSecundario, `${codigo}-${id}`);
            }
          }

          if (residuo.fotos && residuo.fotos.length > 0) {
            for await (const foto of residuo.fotos) {
              foto.nome = `Foto do resíduo ${residuo.codigo ?? ''}`;
              foto.origem = 'OSR';

              const res = await this.iDeviceImagemRepositorio.inserirImagem(foto, `${codigo}-${id}`);
              if(typeof res === 'number') foto.id = res;
            }
          }
        }
      }

      if (rascunho.mtrs && rascunho.mtrs.length > 0) {
        await this.iDeviceMtrRepositorio.deletarMtr(codigo);

        for await (const mtr of rascunho.mtrs) {
          await this.iDeviceMtrRepositorio.deletarEstadosMtr(mtr?.mtr && mtr.mtr.length > 0 ? mtr.mtr : mtr?.mtrCodBarras ?? '');
        }

        for await (const mtr of rascunho.mtrs) {
          await this.iDeviceMtrRepositorio.inserirMtr(mtr, codigo);

          if (!mtr.hasSinir && mtr.estado) {
            await this.iDeviceMtrRepositorio.inserirEstadoMtr(
              mtr.estado,
              mtr?.mtr && mtr.mtr.length > 0 ? mtr.mtr : mtr?.mtrCodBarras ?? '',
            );
          }
        }
      }

      if (rascunho?.equipamentos && rascunho.equipamentos?.length > 0) {
        await this.iDeviceResiduoRepositorio.deletarEquipamento(codigo);

        for await (const equipamento of rascunho.equipamentos) {
          await this.iDeviceResiduoRepositorio.inserirEquipamento(equipamento, codigo);
        }
      }

      if (rascunho?.equipamentosRetirados && rascunho.equipamentosRetirados?.length > 0) {
        await this.iDeviceResiduoRepositorio.deletarEquipamento(`${codigo}$RETIRADO`);

        for await (const equipamentoRetirado of rascunho.equipamentosRetirados) {
          await this.iDeviceResiduoRepositorio.inserirEquipamento(equipamentoRetirado, `${codigo}$RETIRADO`);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
