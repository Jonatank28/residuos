import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { setEndereco } from '../../../../entities/endereco';
import { IFiltro } from '../../../../entities/filtro';
import { IOrder } from '../../../../entities/order';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export interface IPegarNovasColetasParams {
  filtros?: IFiltro;
  search?: string;
}

export default class PegarNovasColetasUseCase implements UseCase<IPegarNovasColetasParams, IOrder[] | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) {}

  async execute(params: IPegarNovasColetasParams): Promise<IOrder[] | Error> {
    try {
      const ordens: IOrder[] = [];
      const response = await this.iDeviceOrdemServicoRepositorio.pegarNovasColetas(params.search ?? '', params.filtros ?? {});

      if (response.length > 0) {
        for await (const coleta of response._array) {
          const endereco = await this.iDeviceEnderecoRepositorio.pegarEndereco(coleta?.codigoVinculo ?? '');
          const imagensOS = await this.iDeviceImagemRepositoio.pegarImagens(coleta?.codigoVinculo ?? '');
          const equipamentosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(coleta?.codigoVinculo ?? '');
          const equipamentosRetiradosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(
            `${coleta?.codigoVinculo ?? ''}$RETIRADO`,
          );
          const residuosOS = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(coleta?.codigoVinculo ?? '');
          const mtrsOS = await this.iDeviceMtrRepositorio.pegarMtrs(coleta?.codigoVinculo ?? '');
          const motivoOS = await this.iDeviceMotivoRepositorio.pegarMotivo(coleta?.codigoVinculo ?? '');
          const motivoRecusaAssinaturaOS = await this.iDeviceMotivoRepositorio.pegarMotivoRecusaAssinatura(
            coleta?.codigoVinculo ?? '',
          );

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
              if (residuo?.xImobilizadoGenerico && residuo?.codigo) {
                const residuosSecundarios = await this.iDeviceResiduoRepositorio.pegarResiduosSecundariosPesagem(
                  `${coleta?.codigoVinculo}-${residuo.id}`,
                );

                if (residuosSecundarios && residuosSecundarios._array) {
                  residuo.residuosSecundarios = residuosSecundarios._array;
                }
              }
              const imobilizadoNoResiduo = await this.iDeviceResiduoRepositorio.pegarImobilizadoDoResiduoVinculo(
                `@IMOBILIZADO_RESIDUO:${residuo?.codigo}-CLIENTE:${coleta.codigoCliente}`,
              );

              if (imobilizadoNoResiduo?._array?.[0]?.codigo) {
                residuo.imobilizado = imobilizadoNoResiduo._array[0];
              }

              const imagensResiduo = await this.iDeviceImagemRepositoio.pegarImagens(residuo?.codigoHashResiduo ?? '');

              if (imagensResiduo.length > 0) {
                residuo.fotos = imagensResiduo._array;
              }
            }
          }

          if (mtrsOS.length > 0) {
            coleta.mtrs = mtrsOS._array;

            for await (const mtr of coleta.mtrs) {
              if (!mtr.hasSinir && mtr?.codigoEstado) {
                const responseEstadoMtr = await this.iDeviceMtrRepositorio.pegarEstadoMtr(
                  mtr.codigoEstado,
                  coleta?.codigoVinculo ?? '',
                );

                if (responseEstadoMtr && responseEstadoMtr?.codigo) {
                  mtr.estado = responseEstadoMtr;
                }
              }
            }
          }

          if (motivoOS && motivoOS?.codigo) coleta.motivo = motivoOS;

          if (motivoRecusaAssinaturaOS && motivoRecusaAssinaturaOS?.motivo) {
            coleta.motivoRecusaAssinatura = motivoRecusaAssinaturaOS;
          }

          ordens.push(coleta);
        }
      }

      return ordens;
    } catch (e) {
      return ApiException(e);
    }
  }
}
