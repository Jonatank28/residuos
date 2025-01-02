import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import I18n from 'i18n-js';
import { SemConteudo } from 'vision-common';
import Controller from './controller';
import Botao from '../../../componentes/botao';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoResiduo from '../../../componentes/cartaoResiduo';
import { AuthRoutes } from '../../../routes/routes';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../../routes/types';
import KmAlert from '../../../componentes/kmAltert';
import { FlatList } from 'react-native';

const VIEWABILITY_CONFIG = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 100,
};

const TelaColetaResiduos: IScreenAuth<AuthRoutes.ResiduosDaColeta> = ({ navigation, route }) => {
  const { primary, secundary, colors, text } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        temIconeDireita={
          !!(
            controller.residuos?.length > 0 &&
            controller.configuracoes?.permiteExcluirResiduos &&
            !controller.validatingSignature
          )
        }
        nomeIconeDireita="trash"
        naoTemIconeEsquerda={controller.validatingSignature}
        titulo={I18n.t('screens.collectResidues.title')}
        onPressIconeEsquerda={controller.goBackFunction}
        onPressIconeDireita={controller.toogleDeletar}
      />
      <Styles.Container>
        {controller?.residuos?.length > 0 ? (
          <>
            {controller.hasDuplicado && (
              <Styles.DuplicadoMensagemContainer>
                <Styles.Titulo>
                  {I18n.t('screens.collectResidues.attention')}{' '}
                  <Styles.Descricao>{I18n.t('screens.collectResidues.attentionMessage')}</Styles.Descricao>
                </Styles.Titulo>
              </Styles.DuplicadoMensagemContainer>
            )}
            {!controller.hasDuplicado && (
              <Styles.DuplicadoMensagemContainer>
                <Styles.Descricao>Total de Resíduos: {controller.residuos?.length ?? 0}</Styles.Descricao>
              </Styles.DuplicadoMensagemContainer>
            )}
            {!controller.loadingData ? (
              <FlatList
                data={controller.residuos}
                keyExtractor={(_, index) => String(index)}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={0}
                onScroll={controller.dimissKeyboard}
                viewabilityConfig={VIEWABILITY_CONFIG}
                removeClippedSubviews={true}
                disableVirtualization
                renderItem={({ item, index }) => (
                  <CartaoResiduo
                    residuo={item}
                    hasLoading={controller.validatingSignature}
                    onPressAdicionarQuantidade={() => controller.onPressAdicionarQuantidade(index)}
                    onPressDiminuirQuantidade={() => controller.onPressDiminuirQuantidade(index)}
                    onChangeQuantidade={quantidade => controller.onChangeQuantidadeResiduo(index, quantidade)}
                    showDeletar={controller.showDeletar}
                    showValores={!!controller.configuracoes.mostrarValoresOSResiduos}
                    hasQuantidadeContainer={!!controller.configuracoes?.habilitarAssinaturaQuantidadeTelaResiduos}
                    mostrarPesoBruto={Boolean(item.residuosSecundarios && item.residuosSecundarios?.length > 0)}
                    hasDuplicad={controller.verificaResiduoDuplicado(item)?.length > 1}
                    podeExcluirResiduo={controller?.configuracoes?.permiteExcluirResiduos ?? false}
                    margemBaixo={10}
                    numeroCasasDecimais={controller.numeroCasasDecimais}
                    onPressDelete={async () => {
                      await controller.setIndexEdit(index);
                      controller.showDeletarAlert(index);
                    }}
                    onPressCard={() => {
                      controller.setIndexEdit(index);
                      controller.onPressEdit(item);
                    }}
                  />
                )}
                ListEmptyComponent={() => (
                  <Styles.SemConteudoContainer>
                    <SemConteudo texto={I18n.t('screens.collectEquipament.notFound')} nomeIcone="clipboard" />
                  </Styles.SemConteudoContainer>
                )}
              />
            ) : (
              <Styles.SemConteudoContainer>
                <CustomActiveIndicator />
              </Styles.SemConteudoContainer>
            )}
          </>
        ) : (
          <Styles.SemConteudoContainer>
            <SemConteudo texto={I18n.t('screens.collectResidues.notFound')} nomeIcone="file-text" />
          </Styles.SemConteudoContainer>
        )}
        {controller.configuracoes?.habilitarAssinaturaQuantidadeTelaResiduos && !controller.validatingSignature && (
          <Styles.ObservacoesContainer>
            <Styles.Input
              multiline
              autoCorrect
              maxLength={200}
              textAlignVertical="top"
              placeholderTextColor={text.input.placeholderColor}
              value={controller.observacao}
              placeholder="Observações"
              onChangeText={controller.onChangeObservacao}
            />
          </Styles.ObservacoesContainer>
        )}
        {!controller.validatingSignature && (
          <Styles.BotaoContainer
            marginLeft={10}
            marginRight={10}
            marginBottom={controller.configuracoes?.habilitarAssinaturaQuantidadeTelaResiduos ? 10 : 20}>
            <Botao
              texto={I18n.t('screens.collectResidues.add')}
              backgroundColor={primary}
              corTexto={secundary}
              onPress={controller.validatingSignature ? undefined : controller.navigateToListaResiduos}
            />
            <Styles.Spacer />
            <Botao
              texto={I18n.t('screens.collectResidues.continue')}
              backgroundColor={colors.orange}
              corTexto={secundary}
              onPress={() => {
                controller.validatingSignature
                  ? undefined
                  : controller.configuracoes.exibeMensagemQuantidadeResiduosAdicionadosOs
                    ? controller.mensagemParaContinuarOuAssinar(false)
                    : controller.continuarColeta();
              }}
            />
          </Styles.BotaoContainer>
        )}
        {controller.configuracoes?.habilitarAssinaturaQuantidadeTelaResiduos && (
          <Styles.BotaoContainer marginLeft={10} marginRight={10} marginBottom={10}>
            <Botao
              texto={I18n.t('screens.collectResidues.signature')}
              backgroundColor={primary}
              corTexto={secundary}
              isLoading={controller.validatingSignature}
              disable={controller.isButtonDisabled}
              onPress={() => {
                controller.configuracoes.exibeMensagemQuantidadeResiduosAdicionadosOs
                  ? controller.mensagemParaContinuarOuAssinar(true)
                  : controller.validarColetaAssinatura(false);
              }}
            />
          </Styles.BotaoContainer>
        )}
      </Styles.Container>
      <KmAlert
        active={controller.kmAlert}
        kmInicial={controller.kmInicial}
        onPressClose={() => controller.setKmAlert(false)}
        kmFinal={controller.kmFinal}
        onPressBotao={() => controller.validarColetaAssinatura(true)}
        setKmFinal={controller.setKmFinal}
        setKmInicial={controller.setKmInicial}
      />
    </>
  );
};

export default TelaColetaResiduos;
