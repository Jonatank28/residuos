import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { setEndereco } from '../../../../entities/endereco';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';
import { auditar } from '../../../../../auditoriaHelper';

export default class PegarColetaAgendadaOfflineUseCase implements UseCase<number, IOrder | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) { }

  async execute(codigoOS: number): Promise<IOrder | Error> {
    try {
      let coleta: IOrder = {};
      const response = await this.iDeviceOrdemServicoRepositorio.pegarColetaAgendadaPendente(codigoOS);

      if (response) {
        coleta = response;

        const codigo = `@VRCOLETAAGENDADAPENDENTE:${codigoOS}`;
        const codigoRetirado = `@VRCOLETAAGENDADAPENDENTE$RETIRADO:${codigoOS}`;

        const endereco = await this.iDeviceEnderecoRepositorio.pegarEndereco(codigo);
        const imagensOS = await this.iDeviceImagemRepositoio.pegarImagens(codigo);
        const equipamentosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigo);
        const equipamentosRetiradosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigoRetirado);
        const residuosOS = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);

        const mtrsOS = await this.iDeviceMtrRepositorio.pegarMtrs(codigo);
        const motivoOS = await this.iDeviceMotivoRepositorio.pegarMotivo(codigo);
        const motivoRecusaAssinaturaOS = await this.iDeviceMotivoRepositorio.pegarMotivoRecusaAssinatura(codigo);

        if (endereco) {
          coleta.enderecoOS = setEndereco(endereco);
        }

        if (imagensOS.length > 0) {
          coleta.fotos = imagensOS._array;
        }

        if (equipamentosOS.length > 0) {
          coleta.equipamentos = equipamentosOS._array;
        }

        if (equipamentosRetiradosOS.length > 0) {
          coleta.equipamentosRetirados = equipamentosRetiradosOS._array;
        }

        if (residuosOS.length > 0) {
          coleta.residuos = residuosOS._array;

          for await (const residuo of coleta.residuos) {
            if (residuo.codigo) {
              residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

              // pega resíduos secundários
              if (residuo?.xImobilizadoGenerico && residuo?.codigo) {
                const residuosSecundarios = await this.iDeviceResiduoRepositorio.pegarResiduosSecundariosPesagem(
                  `${codigo}-${residuo.id}`,
                );

                if (residuosSecundarios && residuosSecundarios._array) {
                  residuo.residuosSecundarios = residuosSecundarios._array;
                }
              }

              const imobilizadoNoResiduo = await this.iDeviceResiduoRepositorio.pegarImobilizadoDoResiduoVinculo(
                `@IMOBILIZADO_RESIDUO:${residuo.codigo}-OS:${coleta.codigoOS}`,
              );

              if (imobilizadoNoResiduo?._array?.[0]?.codigo) {
                residuo.imobilizado = imobilizadoNoResiduo._array[0];
              }

              const imagensResiduo = await this.iDeviceImagemRepositoio.pegarImagens(`${codigo}-${residuo.id}`);

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
  }
}
