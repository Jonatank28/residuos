import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { BottomModal, formatterCurrency, ItemContainer } from 'vision-common';
import Botao from '../../../componentes/botao';
import Cabecalho from '../../../componentes/cabecalho';
import { AuthRoutes } from '../../../routes/routes';
import CartaoResiduoLocal from '../../../componentes/cartaoResiduoLocal';
import CartaoEquipamentoLocal from '../../../componentes/cartaoEquipamentoLocal';
import { IScreenAuth } from '../../../routes/types';

const TelaResumoColeta: IScreenAuth<AuthRoutes.ResumoDaColeta> = ({ navigation, route }) => {
  const { primary, secundary, colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.collectResume.title')}
        temIconeDireita
        nomeIconeDireita="printer"
        onPressIconeDireita={controller.setVisivelModel}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <Styles.ClienteContainer>
            <Styles.ClienteHeaderContainer hasBorder>
              <Styles.Titulo>
                {controller.coleta && controller.coleta.nomeCliente
                  ? `${controller.coleta.codigoCliente} - ${controller.coleta.nomeCliente.toUpperCase()}`
                  : ''}
              </Styles.Titulo>
            </Styles.ClienteHeaderContainer>
            <Styles.ClienteBodyContainer>
              {controller.configuracoes?.mostrarValoresOSResiduos && (
                <>
                  <Styles.Row>
                    <Styles.Descricao>Valor</Styles.Descricao>
                    <Styles.Descricao>
                      {formatterCurrency(controller.calcularValorOS(), { prefix: 'R$ ', precision: 2 })}
                    </Styles.Descricao>
                  </Styles.Row>
                  <Styles.MensagemAlertaValorOS>
                    O valor acima é apenas um demonstrativo, podem ser alterados conforme necessidade ou faturamento
                  </Styles.MensagemAlertaValorOS>
                </>
              )}
              <Styles.Row>
                <Styles.Descricao bold>{I18n.t('screens.collectResume.work')}</Styles.Descricao>
                <Styles.Descricao flex numberOfLines={1} ellipsizeMode="tail">
                  {controller.coleta.nomeObra ?? ''}
                </Styles.Descricao>
              </Styles.Row>
              <Styles.Row>
                <Styles.Descricao bold>{I18n.t('screens.collectResume.contract')}</Styles.Descricao>
                <Styles.Descricao flex>{controller.coleta.codigoContratoObra ?? ''}</Styles.Descricao>
              </Styles.Row>
            </Styles.ClienteBodyContainer>
          </Styles.ClienteContainer>
          {controller.residuosNormais().length > 0 && (
            <ItemContainer title={I18n.t('screens.collectResume.residuesList')} marginBottom={10}>
              {controller.residuosNormais().map((residuo, index) => (
                <>
                  <CartaoResiduoLocal
                    key={String(index)}
                    hasBorder
                    residuo={residuo}
                    margemBaixo={5}
                    onPressCard={() => controller.navigateToDetalhesResiduo(residuo)}
                  />
                </>
              ))}
            </ItemContainer>
          )}

          {controller.residuosGenericos().length > 0 && (
            <ItemContainer title="Resíduos Coletados" marginBottom={10}>
              <>
                {controller.residuosGenericos().map((residuo, index) => (
                  <CartaoResiduoLocal
                    key={String(index)}
                    hasBorder
                    residuo={residuo}
                    margemBaixo={5}
                    onPressCard={() => controller.navigateToDetalhesResiduo(residuo)}
                  />
                ))}
                <Styles.Descricao>
                  Total Equipamentos Genéricos: {controller.contagemResiduosGenericos().quantidade} (
                  {controller.contagemResiduosGenericos().unidade})
                </Styles.Descricao>
                <Styles.Descricao>
                  Total Resíduos: {controller.contagemTotalSubResiduos().quantidade} (
                  {controller.contagemTotalSubResiduos().unidade})
                </Styles.Descricao>
              </>
            </ItemContainer>
          )}

          {controller.coleta?.equipamentos && controller.coleta.equipamentos?.length > 0 && (
            <ItemContainer title={I18n.t('screens.collectResume.equipmentList')}>
              <Styles.TotalEquipamentosContainer>
                <Styles.TotalEquipamentosAlocados>
                  {'Total Equipamentos Alocados: ' + controller.coleta.equipamentos?.length}
                </Styles.TotalEquipamentosAlocados>
              </Styles.TotalEquipamentosContainer>
              {controller.coleta.equipamentos.map((equipamento, index) => (
                <CartaoEquipamentoLocal
                  key={String(index)}
                  equipamento={equipamento}
                  showIdentificacao={controller.configuracoes?.habilitarCodIdentificacaoImobilizado}
                  margemBaixo={5}
                  onPressCard={() => controller.navigateToDetalhesEquipamentos(equipamento)}
                />
              ))}
            </ItemContainer>
          )}
          <Styles.BotaoContainer>
            {controller.coleta &&
              controller.coleta.motivo &&
              controller.coleta.motivo.codigo &&
              !controller.coleta.motivo.obrigarAssinaturaResponsavel && (
                <>
                  <Botao
                    texto={I18n.t('screens.collectResume.send')}
                    backgroundColor={colors.orange}
                    corTexto={secundary}
                    onPress={controller.validarColeta}
                  />
                  <Styles.Spacer />
                </>
              )}
            <Botao
              texto={I18n.t('screens.collectResume.signature')}
              backgroundColor={primary}
              corTexto={secundary}
              onPress={
                controller.coleta &&
                  controller.coleta.motivo &&
                  controller.coleta.motivo.codigo &&
                  !controller.coleta.motivo.obrigarAssinaturaResponsavel
                  ? controller.navigateToAssinatura
                  : controller.validarColeta
              }
            />
          </Styles.BotaoContainer>
        </Styles.ScrollContainer>
        <BottomModal
          active={controller.visivel}
          title={I18n.t('screens.collectResume.printOS')}
          onPressIcone={controller.setVisivelModel}>
          <Styles.PrintOptionContainer activeOpacity={0.5} onPress={controller.imprimirOS}>
            <Styles.Titulo>{I18n.t('screens.collectResume.wifi')}</Styles.Titulo>
          </Styles.PrintOptionContainer>
          <Styles.PrintOptionContainer activeOpacity={0.5} onPress={controller.navigateToImpressoras}>
            <Styles.Titulo>{I18n.t('screens.collectResume.bluetooth')}</Styles.Titulo>
          </Styles.PrintOptionContainer>
        </BottomModal>
      </Styles.Container>
    </>
  );
};

export default TelaResumoColeta;
