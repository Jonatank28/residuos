import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../../../../entities/order';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';
import { deleteParadasFromStorage, getParadasFromStorage, setParadasToStorage } from '../../../../../../app/utils/paradas';

// Pega a coleta com vinculo de pendente e coloca como enviada
const gravarParadasLocal = async (coleta: IOrder, codigo: string) => {
  const res = await getParadasFromStorage(coleta.codigoAntigo as string);
  const paradas = res ? JSON.parse(res) : [];
  await deleteParadasFromStorage(coleta.codigoAntigo as string);
  await setParadasToStorage(codigo as string, paradas);
};

export default class GravarColetaEnviadaUseCase implements UseCase<IOrder, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) { }

  async execute(coleta: IOrder): Promise<void | Error> {
    try {
      await this.iDeviceOrdemServicoRepositorio.inserirColetaEnviada(coleta, coleta?.codigoVinculo ?? '');
      await gravarParadasLocal(coleta, coleta?.codigoVinculo ?? '');

      if (coleta?.enderecoOS) {
        await this.iDeviceEnderecoRepositorio.inserirEndereco(coleta?.codigoVinculo ?? '', coleta.enderecoOS);
      }

      if (coleta.fotos && coleta.fotos.length > 0) {
        for await (const foto of coleta.fotos) {
          foto.nome = `Foto da coleta ${coleta?.codigoVinculo ?? '' ?? ''}`;
          foto.origem = 'OS';

          const res = await this.iDeviceImagemRepositorio.inserirImagem(foto, coleta?.codigoVinculo ?? '');
          if (typeof res === 'number') foto.id = res;
        }
      }

      if (coleta.residuos && coleta.residuos.length > 0) {
        for await (const residuo of coleta.residuos) {
          residuo.xImobilizadoGenerico = Boolean(residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0);
          const id = await this.iDeviceResiduoRepositorio.inserirResiduo(residuo, coleta?.codigoVinculo ?? '');

          residuo.codigoIDResiduoGenerico = id;

          // Insere resíduos secundários
          if (residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0) {
            for await (const residuoSecundario of residuo.residuosSecundarios) {
              residuoSecundario.xImobilizadoGenerico = false;

              await this.iDeviceResiduoRepositorio.inserirResiduoPesagem(
                residuoSecundario,
                `${coleta?.codigoVinculo ?? ''}-${id}`,
              );
            }
          }

          if (residuo.fotos && residuo.fotos.length > 0) {
            for await (const foto of residuo.fotos) {
              foto.nome = `Foto do resíduo ${residuo.codigo ?? ''}`;
              foto.origem = 'OSR';

              const res = await this.iDeviceImagemRepositorio.inserirImagem(foto, `${coleta?.codigoVinculo ?? ''}-${id}`);
              if (typeof res === 'number') foto.id = res;
            }
          }
        }
      }

      if (coleta.motivo && coleta.motivo.codigo) {
        await this.iDeviceMotivoRepositorio.inserirMotivo(coleta.motivo, coleta?.codigoVinculo ?? '');
      }

      if (coleta?.equipamentos && coleta.equipamentos?.length > 0) {
        for await (const equipamento of coleta.equipamentos) {
          await this.iDeviceResiduoRepositorio.inserirEquipamento(equipamento, coleta?.codigoVinculo ?? '');
        }
      }

      if (coleta?.equipamentosRetirados && coleta.equipamentosRetirados?.length > 0) {
        for await (const equipamentoRetirado of coleta.equipamentosRetirados) {
          await this.iDeviceResiduoRepositorio.inserirEquipamento(equipamentoRetirado, `${coleta?.codigoVinculo ?? ''}$RETIRADO`);
        }
      }

      if (coleta?.mtrs && coleta.mtrs?.length > 0) {
        for await (const mtr of coleta.mtrs) {
          await this.iDeviceMtrRepositorio.inserirMtr(mtr, coleta?.codigoVinculo ?? '');

          if (!mtr.hasSinir && mtr.estado && mtr.estado.codigo) {
            await this.iDeviceMtrRepositorio.inserirEstadoMtr(mtr.estado, coleta?.codigoVinculo ?? '');
          }
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
