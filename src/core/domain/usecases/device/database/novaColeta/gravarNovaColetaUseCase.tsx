import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';

export default class GravarNovaColetaUseCase implements UseCase<IOrder, void | Error> {
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
      const codigo = `@VRNOVACOLETAPENDENTE:${coleta.codigoCliente}-${new Date().getTime()}`;

      coleta.classificacaoOS = 3;
      coleta.codigoVinculo = codigo;

      await this.iDeviceOrdemServicoRepositorio.inserirNovaColeta(coleta, codigo);

      if (coleta.enderecoOS) {
        await this.iDeviceEnderecoRepositorio.inserirEndereco(codigo, coleta.enderecoOS);
      }

      if (coleta.motivo && coleta.motivo.codigo) {
        await this.iDeviceMotivoRepositorio.inserirMotivo(coleta.motivo, codigo);
      }

      if (
        coleta.motivoRecusaAssinatura &&
        coleta.motivoRecusaAssinatura.nomeResponsavel &&
        coleta.motivoRecusaAssinatura.motivo
      ) {
        await this.iDeviceMotivoRepositorio.inserirMotivoRecusaAssinatura(coleta.motivoRecusaAssinatura, codigo);
      }

      if (coleta?.mtrs && coleta?.mtrs?.length > 0) {
        for await (const mtr of coleta.mtrs) {
          await this.iDeviceMtrRepositorio.inserirMtr(mtr, codigo);

          if (!mtr.hasSinir && mtr.estado && mtr.estado.codigo) {
            await this.iDeviceMtrRepositorio.inserirEstadoMtr(mtr.estado, codigo);
          }
        }
      }

      if (coleta?.fotos && coleta.fotos?.length > 0) {
        for await (const foto of coleta.fotos) {
          foto.nome = `Foto da coleta ${coleta.codigoOS}`;
          foto.origem = 'OS';

          const res = await this.iDeviceImagemRepositoio.inserirImagem(foto, codigo);
          if(typeof res === 'number') foto.id = res;
        }
      }

      if (coleta?.residuos && coleta.residuos?.length > 0) {
        for await (const residuo of coleta.residuos) {
          const id = await this.iDeviceResiduoRepositorio.inserirResiduo(residuo, codigo);

          // Insere resíduos secundários
          if (residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0) {
            residuo.xImobilizadoGenerico = true;

            for await (const residuoSecundario of residuo.residuosSecundarios) {
              residuoSecundario.xImobilizadoGenerico = false;

              await this.iDeviceResiduoRepositorio.inserirResiduoPesagem(
                residuoSecundario,
                `${codigo}-${id}`,
              );
            }
          }

          if (residuo?.fotos && residuo.fotos?.length > 0) {
            for await (const foto of residuo.fotos) {
              foto.nome = `Foto do resíduo ${residuo.codigo}`;
              foto.origem = 'OSR';

              const res = await this.iDeviceImagemRepositoio.inserirImagem(foto, residuo?.codigoHashResiduo ?? '');
              if(typeof res === 'number') foto.id = res;
            }
          }
        }
      }

      if (coleta.equipamentos && coleta.equipamentos.length > 0) {
        for await (const equipamento of coleta.equipamentos) {
          await this.iDeviceResiduoRepositorio.inserirEquipamento(equipamento, codigo);
        }
      }

      if (coleta.equipamentosRetirados && coleta.equipamentosRetirados.length > 0) {
        for await (const equipamentoRetirado of coleta.equipamentosRetirados) {
          await this.iDeviceResiduoRepositorio.inserirEquipamento(equipamentoRetirado, `${codigo}$RETIRADO`);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
