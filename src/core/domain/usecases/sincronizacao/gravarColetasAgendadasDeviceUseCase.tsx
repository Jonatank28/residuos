import { ApiException, removerQuebrasLinha, replaceString, timezoneDate } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import Constants from 'expo-constants';
import { IOrder } from '../../entities/order';
import { IDeviceOrdemServicoRepositorio } from '../../repositories/device/ordemServicoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../repositories/device/enderecoRepositorio';
import { IDeviceResiduoRepositorio } from '../../repositories/device/residuoRepositorio';
import { IDeviceMtrRepositorio } from '../../repositories/device/mtrRepositorio';
import { IDeviceChecklistRepositorio } from '../../repositories/device/checklistRepositorio';

export interface IGravarColetasAgendadasParams {
  coletas: IOrder[];
  userID: number;
}

export default class GravarColetasAgendadasDeviceUseCase implements UseCase<IGravarColetasAgendadasParams, void | Error> {
  constructor(
    private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
    private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
    private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
    private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
    private readonly iDeviceCheckDevicelistRepositorio: IDeviceChecklistRepositorio,
  ) {}

  async execute(params: IGravarColetasAgendadasParams): Promise<void | Error> {
    try {
      let sqlColetaParams: string = '';
      let sqlEnderecoParams: string = '';
      let sqlChecklistParams: string = '';
      let sqlGruposChecklistParams: string = '';
      let sqlPerguntasGruposChecklistParams: string = '';
      let sqlResiduosParams: string = '';
      let sqlEquipamentosParams: string = '';
      let sqlMtrsParams: string = '';
      let sqlEstadosMtrsParams: string = '';

      for await (const coleta of params.coletas) {
            const codigo = `@VRCOLETAAGENDADA:${coleta.codigoOS}`;

            sqlColetaParams += `${sqlColetaParams.length > 0 ? ',' : ''}(
              ${params.userID},
              ${coleta.codigoOS},
              ${coleta?.codigoOrdem},
              ${coleta?.codigoRoterizacao},
              ${coleta?.codigoRota},
              ${coleta?.codigoPonto},
              "${replaceString(coleta?.placa ?? '')}",
              "${replaceString(coleta?.periodicidade ?? '').length > 0 ? replaceString(coleta?.periodicidade ?? '') : ''}",
              "${replaceString(coleta?.mtr ?? '')}",
              "${replaceString(coleta?.codigoBarraMTR ?? '')}",
              ${coleta?.codigoCliente},
              ${coleta?.codigoMotorista ?? 0},
              ${coleta?.codigoDispositivo ?? 0},
              "${replaceString(coleta?.assinaturaBase64 ?? '')}",
              "${replaceString(coleta?.nomeCliente ?? '')}",
              "${replaceString(coleta?.nomeFantasiaCliente ?? '')}",
              "${replaceString(coleta?.telefoneCliente ?? '')}",
              "${replaceString(coleta?.CNPJCliente ?? '')}",
              "${replaceString(coleta?.CPFCNPJResponsavel ?? '')}",
              "${replaceString(coleta?.nomeResponsavel ?? '')}",
              "${replaceString(coleta?.funcaoResponsavel ?? '')}",
              "${replaceString(coleta?.emailResponsavel ?? '')}",
              "${replaceString(Constants?.manifest?.version ?? '')}",
              "${coleta.dataOS}",
              ${coleta?.codigoObra},
              ${coleta?.codigoContratoObra},
              "${replaceString(coleta?.nomeObra ?? '')}",
              "${replaceString(coleta?.observacaoOS ?? '')}",
              "${replaceString(coleta?.referenteOS ?? '')}",
              "${replaceString(String(coleta?.classificacaoOS ?? ''))}",
              ${coleta?.ordemColetaPendente},
              ${coleta.coletouPendente ? 1 : 0},
              ${coleta?.codigoDestinador ?? null},
              ${coleta?.codigoEmpresa ?? null},
              ${coleta?.KMInicial ?? null},
              ${coleta?.KMFinal ?? null}
            )`;

            if (coleta?.enderecoOS) {
              sqlEnderecoParams += `${sqlEnderecoParams.length > 0 ? ',' : ''}(
                    ${params.userID},
                    "${codigo}",
                    "${replaceString(coleta.enderecoOS?.rua ?? '')}",
                    "${replaceString(coleta.enderecoOS?.bairro ?? '')}",
                    ${Number(coleta.enderecoOS?.numero ?? 0)},
                    "${replaceString(coleta.enderecoOS?.letra ?? '')}",
                    "${replaceString(coleta.enderecoOS?.complemento ?? '')}",
                    "${replaceString(coleta.enderecoOS?.cidade ?? '')}",
                    "${replaceString(coleta.enderecoOS?.uf ?? '')}",
                    "${replaceString(
                      String(
                        coleta.enderecoOS?.latLng && coleta.enderecoOS.latLng?.latitude
                          ? coleta.enderecoOS?.latLng?.latitude
                          : '',
                      ),
                    )}",
                    "${replaceString(
                      String(
                        coleta.enderecoOS?.latLng && coleta.enderecoOS.latLng?.longitude
                          ? coleta.enderecoOS?.latLng?.longitude
                          : '',
                      ),
                    )}"
                  )`;

              if (coleta?.codigoOS && coleta?.checklist?.codigo) {
                sqlChecklistParams += `${sqlChecklistParams.length > 0 ? ',' : ''}(
                  ${coleta.checklist?.codigo ?? 0},
                  ${coleta.codigoOS},
                  ${params.userID},
                  "${replaceString(coleta.checklist?.momentoExibicao ?? '')}",
                  ${coleta.checklist?.permiteSegundaFeira ? 1 : 0},
                  ${coleta.checklist?.permiteTercaFeira ? 1 : 0},
                  ${coleta.checklist?.permiteQuartaFeira ? 1 : 0},
                  ${coleta.checklist?.permiteQuintaFeira ? 1 : 0},
                  ${coleta.checklist?.permiteSextaFeira ? 1 : 0},
                  ${coleta.checklist?.permiteSabado ? 1 : 0},
                  ${coleta.checklist?.permiteDomingo ? 1 : 0}
                )`;

                if (coleta.checklist?.grupos?.length > 0) {
                  for await (const grupo of coleta.checklist.grupos) {
                    sqlGruposChecklistParams += `${sqlGruposChecklistParams.length > 0 ? ',' : ''}(
                      ${grupo.codigo},
                      ${params.userID},
                      "${codigo}",
                      "${replaceString(grupo?.descricao ?? '')}",
                      ${grupo?.ordem ?? 0}
                    )`;

                    if (grupo?.perguntas && grupo.perguntas.length > 0) {
                      for await (const pergunta of grupo.perguntas) {
                        sqlPerguntasGruposChecklistParams += `${sqlPerguntasGruposChecklistParams.length > 0 ? ',' : ''}(
                          ${pergunta.codigo},
                          "${replaceString(pergunta?.descricao ?? '')}",
                          ${params.userID},
                          "${`${codigo}-${grupo.codigo}`}",
                          "${replaceString(pergunta?.classificacoes ?? '')}",
                          ${pergunta?.habilitaObservacao ? 1 : 0},
                          "${replaceString(pergunta?.observacao ?? '')}",
                          ${pergunta?.resposta},
                          ${pergunta?.codigoResposta}
                        )`;
                      }
                    }
                  }
                }
              }

              if (coleta?.residuos && coleta.residuos?.length > 0) {
                for await (const residuo of coleta.residuos) {
                  sqlResiduosParams += `${sqlResiduosParams.length > 0 ? ',' : ''}(
                    ${params.userID},
                    ${residuo.codigo},
                    ${residuo?.codigoIDResiduo},
                    ${residuo?.xExigeInteiro ? 1 : 0},
                    "${codigo}",
                    "${replaceString(residuo?.descricao ?? '')}",
                    "${replaceString(residuo?.cor ?? '')}",
                    "${replaceString(residuo?.unidade ?? '')}",
                    "${replaceString(residuo?.quantidade ?? '')}",
                    "${replaceString(residuo?.subGrupo ?? '')}",
                    "${replaceString(removerQuebrasLinha(residuo?.observacao ?? ''))}",
                    ${residuo?.naoConforme ? 1 : 0},
                    ${residuo?.excesso ? 1 : 0},
                    "${replaceString(residuo?.codigoIbama ?? '')}",
                    ${residuo?.codigoEstadoFisico},
                    ${residuo?.codigoSubGrupo},
                    ${residuo?.codigoAcondicionamento},
                    ${residuo?.codigoUnidade},
                    ${residuo?.codigoFormaTratamento},
                    "${replaceString(residuo?.codigoHashResiduo ?? '')}",
                    ${residuo?.preCadastroReferencia ? 1 : 0},
                    ${residuo?.valorUnitario ?? 0},
                    "${residuo?.pesoBruto ?? 0}",
                    "${residuo?.tara ?? 0}",
                    "${residuo?.cubagem ?? 0}",
                    ${0},
                    ${0}
                  )`;
                }
              }

              if (coleta?.equipamentos && coleta.equipamentos?.length > 0) {
                for await (const equipamento of coleta.equipamentos) {
                  sqlEquipamentosParams += `${sqlEquipamentosParams.length > 0 ? ',' : ''}(
                    ${params.userID},
                    "${codigo}",
                    ${equipamento?.codigoCliente},
                    ${equipamento?.codigoObra},
                    ${equipamento?.codigoContainer},
                    ${equipamento?.codigoMovimentacao},
                    "${replaceString(equipamento?.descricaoContainer ?? '')}",
                    "${replaceString(equipamento?.identificacao ?? '')}",
                    "${equipamento?.dataColocacao ? timezoneDate(equipamento.dataColocacao) : timezoneDate(new Date())}",
                    "${equipamento?.dataRetirada ? timezoneDate(equipamento.dataRetirada) : ''}",
                    ${equipamento?.naoGerarMovimentacao ? 1 : 0},
                    ${equipamento?.xPesoEResiduoImobilizado ? 1 : 0},
                    ${equipamento?.codigoImobilizadoGenerico ?? 0},
                    ${equipamento?.tara ?? 0},
                    ${equipamento?.pesoBruto ?? 0},
                    ${equipamento?.cubagem ?? 0},
                    ${equipamento?.xEtapaPendente ? 1 : 0}
                  )`;
                }
              }

              if (coleta?.mtrs && coleta.mtrs?.length > 0) {
                for await (const mtr of coleta.mtrs) {
                  sqlMtrsParams += `${sqlMtrsParams.length > 0 ? ',' : ''}(
                    ${params.userID},
                    "${codigo}",
                    ${mtr.estado ? mtr.estado.codigo : 0},
                    "${replaceString(mtr?.mtr ?? '')}",
                    "${replaceString(mtr?.mtrCodBarras ?? '')}",
                    ${mtr?.hasSinir ? 1 : 0},
                    "${mtr.dataEmissao ? timezoneDate(mtr.dataEmissao) : timezoneDate(new Date())}",
                    "${replaceString(mtr?.base64MtrOnline ?? '')}"
                  )`;

                  if (!mtr.hasSinir && mtr?.estado && mtr.estado?.codigo) {
                    sqlEstadosMtrsParams += `${sqlEstadosMtrsParams.length > 0 ? ',' : ''}(
                      ${mtr.estado.codigo},
                      ${params.userID},
                      "${codigo}",
                      "${replaceString(mtr.estado?.descricao ?? '')}",
                      ${mtr.estado?.habilitarIntegracaoEstadual ? 1 : 0},
                      ${mtr.estado?.possuiIntegracaoEstadual ? 1 : 0}
                    )`;
                  }
                }
              }
            }
      }

      // INSERE AS COLETAS
      if (sqlColetaParams && sqlColetaParams?.length > 0)
        await this.iDeviceOrdemServicoRepositorio.inserirColetasSincronizacao(sqlColetaParams);

      // INSERE ENDEREÇOS COLETAS
      if (sqlEnderecoParams && sqlEnderecoParams?.length > 0)
        await this.iDeviceEnderecoRepositorio.inserirEnderecosSincronizacao(sqlEnderecoParams);

      // INSERE CHECKLISTS COLETAS
      if (sqlChecklistParams && sqlChecklistParams?.length > 0)
        await this.iDeviceCheckDevicelistRepositorio.inserirChecklistsSincronizacao(sqlChecklistParams);

      // INSERE GRUPOS CHECKLISTS
      if (sqlGruposChecklistParams && sqlGruposChecklistParams?.length > 0)
        await this.iDeviceCheckDevicelistRepositorio.inserirGruposChecklistsSincronizacao(sqlGruposChecklistParams);

      // INSERE PERGUNTAS GRUPOS CHECKLISTS
      if (sqlPerguntasGruposChecklistParams && sqlPerguntasGruposChecklistParams?.length > 0)
        await this.iDeviceCheckDevicelistRepositorio.inserirPerguntaGrupoChecklistSincronizacao(
          sqlPerguntasGruposChecklistParams,
        );

      // INSERE RESÍDUOS COLETA
      if (sqlResiduosParams && sqlResiduosParams?.length > 0)
        await this.iDeviceResiduoRepositorio.inserirResiduoSincronizacao(sqlResiduosParams);

      // INSERE EQUIPAMENTOS COLETA
      if (sqlEquipamentosParams && sqlEquipamentosParams?.length > 0)
        await this.iDeviceResiduoRepositorio.inserirEquipamentoSincronizacao(sqlEquipamentosParams);

      // INSERE MTR's COLETA
      if (sqlMtrsParams && sqlMtrsParams?.length > 0) await this.iDeviceMtrRepositorio.inserirMtrSincronizacao(sqlMtrsParams);

      // INSERE ESTADOS MTR's
      if (sqlEstadosMtrsParams && sqlEstadosMtrsParams?.length > 0)
        await this.iDeviceMtrRepositorio.inserirEstadoMtrSincronizacao(sqlEstadosMtrsParams);
    } catch (e) {
      return ApiException(e);
    }
  }
}
