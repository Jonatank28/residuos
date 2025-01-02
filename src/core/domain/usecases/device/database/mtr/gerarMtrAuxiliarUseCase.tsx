import I18n from 'i18n-js';
import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import BadRequestException from 'vision-common/src/core/domain/exceptions/badRequestException';
import { IGeradorAuxiliar, IMtrAuxiliar } from '../../../../entities/portalMtr/mtrAuxiliar';
import { IDeviceMtrPortalRepositorio } from '../../../../repositories/device/mtrPortalRepositorio';

export interface IGerarMtrAuxiliarParams {
  empresaID: number;
  codigoVinculo: string | number;
  destinadorID: number;
  codigoOS: number;
  clienteID: number;
  estadoID: number;
  obraID?: number;
}

export default class GerarMtrAuxiliarUseCase implements UseCase<IGerarMtrAuxiliarParams, IMtrAuxiliar | Error> {

  constructor(private readonly iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio) { }

  async execute(params: IGerarMtrAuxiliarParams): Promise<IMtrAuxiliar | Error> {
    try {
      let geradorAuxiliar: IGeradorAuxiliar = {};
      const mtrUxiliar: IMtrAuxiliar = {};

      if (String(params.codigoVinculo).includes('NOVACOLETA'))
        geradorAuxiliar = await this.iDeviceMtrPortalRepositorio.pegarDadosGeradorNovaColetaMtr({
          clienteID: params.clienteID,
          codigoVinculo: params.codigoVinculo,
          estadoID: params.estadoID,
          obraID: params.obraID
        });
      else
        geradorAuxiliar = await this.iDeviceMtrPortalRepositorio.pegarDadosGeradorMtr({
          clienteID: params.clienteID,
          codigoOS: params.codigoOS,
          estadoID: params.estadoID,
          obraID: params.obraID
        });

      if (geradorAuxiliar?.codigoUnidade && geradorAuxiliar?.codigoUnidade !== 0)
        mtrUxiliar.dadosGerador = geradorAuxiliar;
      else
        return BadRequestException(I18n.t('screens.collectDetailsLocal.mtr.errors.configurationError'));

      const transportadorAuxiliar = await this.iDeviceMtrPortalRepositorio.pegarDadosTransportador(params.estadoID);

      if (transportadorAuxiliar?.codigoUnidade && transportadorAuxiliar?.codigoUnidade !== 0)
        mtrUxiliar.dadosTransportador = transportadorAuxiliar;
      else
        return BadRequestException(I18n.t('screens.collectDetailsLocal.mtr.errors.conveyorError'));

      const destinadorAuxiliar = await this.iDeviceMtrPortalRepositorio.pegarDadosDestinador(params.destinadorID, params.estadoID);

      if (destinadorAuxiliar?.codigoUnidade && destinadorAuxiliar?.codigoUnidade !== 0)
        mtrUxiliar.dadosDestinador = destinadorAuxiliar;
      else
        return BadRequestException(I18n.t('screens.collectDetailsLocal.mtr.errors.addresseeError'));

      const logoEmpresa = await this.iDeviceMtrPortalRepositorio.pegarLogoEmpresa(params.empresaID);

      if (logoEmpresa)
        mtrUxiliar.logoEmpresa = logoEmpresa;

      const residuosAuxiliar = await this.iDeviceMtrPortalRepositorio.pegarResiduosPortal(params.codigoVinculo, params.estadoID);

      if (residuosAuxiliar.length > 0)
        mtrUxiliar.residuos = residuosAuxiliar._array;
      else
        return BadRequestException(I18n.t('screens.collectDetailsLocal.mtr.errors.residuesError'));

      return mtrUxiliar;
    } catch (e) {
      return ApiException(e);
    }
  };
}
