import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export interface IPegarColetaEnviadaParams {
  codigoOS: number;
  clienteID: number | string;
}

export default class PegarColetaEnviadaUseCase implements UseCase<IPegarColetaEnviadaParams, IOrder | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
  ) { }

  async execute(params: IPegarColetaEnviadaParams): Promise<IOrder | Error> {
    try {
      let coleta: IOrder = {};
      const codigo = Boolean(params.codigoOS && params.codigoOS !== 0) ? `@VRCOLETAENVIADA:${params.codigoOS}` : params.clienteID;

      

      const response = await this.iDeviceOrdemServicoRepositorio.pegarColetaEnviada(codigo);

    

      if (response) {
        coleta = response;

        const enderecoOS = await this.iDeviceEnderecoRepositorio.pegarEndereco(codigo);
        const residuosOS = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);
        const imagensOS = await this.iDeviceImagemRepositorio.pegarImagens(codigo);
        const equipamentosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigo);
        const motivoOS = await this.iDeviceMotivoRepositorio.pegarMotivo(codigo);
        const equipamentosRetiradoOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(`${codigo}$RETIRADO`);
        const mtrsOS = await this.iDeviceMtrRepositorio.pegarMtrs(codigo);

        if (enderecoOS) coleta.enderecoOS = enderecoOS;

        if (residuosOS.length > 0) {
          coleta.residuos = residuosOS._array;

          for await (const residuo of coleta.residuos) {
            residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

            if (residuo?.xImobilizadoGenerico && residuo?.codigo) {

              const residuosSecundarios = await this.iDeviceResiduoRepositorio.pegarResiduosSecundariosPesagem(
                `${codigo}-${residuo.id}`,
              );

              if (residuosSecundarios && residuosSecundarios._array) {
                residuo.residuosSecundarios = residuosSecundarios._array;
              }
            }

            const imagensResiduo = await this.iDeviceImagemRepositorio.pegarImagens(`${codigo}-${residuo.id}`);
            residuo.fotos = imagensResiduo._array;
          }
        }

        if (mtrsOS.length > 0) {
          coleta.mtrs = mtrsOS._array;

          for await (const mtr of coleta.mtrs) {
            if (!mtr.hasSinir && mtr.codigoEstado) {
              const responseEstadoMtr = await this.iDeviceMtrRepositorio.pegarEstadoMtr(mtr.codigoEstado, codigo);

              if (responseEstadoMtr && responseEstadoMtr?.codigo) {
                mtr.estado = responseEstadoMtr;
              }
            }
          }
        }

        if (motivoOS && motivoOS?.codigo) coleta.motivo = motivoOS;
        if (imagensOS.length > 0) coleta.fotos = imagensOS._array;
        if (equipamentosOS.length > 0) coleta.equipamentos = equipamentosOS._array;
        if (equipamentosRetiradoOS.length > 0) coleta.equipamentosRetirados = equipamentosRetiradoOS._array;
      }

      return coleta;
    } catch (e) {
      return ApiException(e);
    }
  }
}
