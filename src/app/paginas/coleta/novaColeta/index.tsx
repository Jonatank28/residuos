import * as React from 'react';
import * as Styles from './styles';
import { Keyboard, Text } from 'react-native';
import Controller from './controller';
import I18n from 'i18n-js';
import { ItemContainer, formatterCurrency, somenteNumeros } from 'vision-common';
import { useTheme } from 'styled-components/native';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoSimples from '../../../componentes/cartaoSimples';
import Botao from '../../../componentes/botao';
import { enderecoFormatado } from '../../../utils/formatter';
import { AuthRoutes } from '../../../routes/routes';
import { IScreenAuth } from '../../../routes/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TelaNovaColeta: IScreenAuth<AuthRoutes.NovaColeta> = ({ navigation, route }) => {
  const { secundary, colors, text, card } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.newCollect.title')}
        onPressIconeEsquerda={controller.goBackFunction}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.ScrollContainer scrollEventThrottle={0} keyboardShouldPersistTaps="always" onScroll={Keyboard.dismiss}>
          <ItemContainer title={I18n.t('screens.newCollect.client')} marginBottom={10}>
            <CartaoSimples
              hasBorder
              descricao={controller.cliente?.nomeFantasia ?? I18n.t('screens.newCollect.selectClient')}
              nomeIcone="chevron-right"
              onPress={controller.navigateToClientes}
              marginBottom={10}
            />
          </ItemContainer>

          <ItemContainer title={I18n.t('screens.newCollect.work')} marginBottom={10}>
            {controller.loadingObra ? (
              <Styles.LoadingObraContainer>
                <Styles.Descricao>Verificando obras...</Styles.Descricao>
              </Styles.LoadingObraContainer>
            ) : controller.temVariasObras || controller.obra?.codigo ? (
              <>
                <CartaoSimples
                  hasBorder
                  descricao={controller.obra.descricao ?? I18n.t('screens.newCollect.selectWork')}
                  nomeIcone="chevron-right"
                  onPress={controller.navigateToObras}
                  marginBottom={10}
                />
              </>
            ) : (
              <Styles.LoadingObraContainer>
                <Styles.Descricao>
                  {controller.cliente?.codigo ? 'Cliente não possui pontos de coleta' : 'Informe um cliente'}
                </Styles.Descricao>
              </Styles.LoadingObraContainer>
            )}
          </ItemContainer>

          {/* // Adicionar parada nova coleta*/}
          {controller.temVariasObras || controller.obra?.codigo && (
            <Styles.NaoColetadoContainer>
              <CartaoSimples
                hasBorder
                descricao={I18n.t('screens.collectDetails.addstop')}
                nomeIcone="chevron-right"
                onPress={controller.navigateToListStops}
              />
            </Styles.NaoColetadoContainer>
          )}

          <Styles.NaoColetadoContainer>
            <Styles.NaoColetadoTituloContainer noCollected={controller.naoColetado}>
              <Styles.Titulo>{I18n.t('screens.newCollect.notCollected')}</Styles.Titulo>
              <Styles.BotaoNaoColetado
                value={controller.naoColetado}
                thumbColor={colors.accent}
                trackColor={{
                  false: card.border,
                  true: colors.accent,
                }}
                onValueChange={controller.onToggleNaoColetado}
              />
            </Styles.NaoColetadoTituloContainer>
            {controller.naoColetado && (
              <>
                <CartaoSimples
                  hasBorder
                  descricao={
                    route.params.motivo && route.params.motivo?.descricao
                      ? route.params.motivo.descricao
                      : I18n.t('screens.newCollect.reasonMessage')
                  }
                  nomeIcone="chevron-right"
                  onPress={controller.navigateToMotivos}
                  marginBottom={10}
                />
                <Styles.Input
                  multiline
                  autoCorrect
                  maxLength={200}
                  textAlignVertical="top"
                  placeholderTextColor={text.input.placeholderColor}
                  value={controller.observacoes}
                  placeholder={I18n.t('screens.newCollect.observation')}
                  onChangeText={controller.setObservacoes}
                />
              </>
            )}
          </Styles.NaoColetadoContainer>

          <ItemContainer title="Quilometragem Inicial" marginBottom={10}>
            <Styles.KMContainer>
              <Styles.KMIconeContainer>
                <FontAwesome name="flag-checkered" size={22}></FontAwesome>
              </Styles.KMIconeContainer>
              <Styles.KMInput
                value={formatterCurrency(controller.KMInicial || 0)}
                placeholderTextColor={text.input.placeholderColor}
                placeholder="0"
                maxLength={10}
                onChangeText={text => controller.setKMInicial(somenteNumeros(text))}
                keyboardType="number-pad"
              />
              <Styles.KMBotaoContainer onPress={controller.setarUltimoKm}>
                <FontAwesome5 name="sync" size={22} color="#FFF"></FontAwesome5>
              </Styles.KMBotaoContainer>
            </Styles.KMContainer>
            {!controller.KMFinalValido && (
              <Styles.MensagemErro>
                A quilometragem é inválida, clique no botão ao lado para pegar a última coletada ou do veiculo
              </Styles.MensagemErro>
            )}
          </ItemContainer>

          {route.params.cliente?.codigo && (
            <ItemContainer
              title={
                controller.obra.endereco && controller.obra.endereco.rua
                  ? I18n.t('screens.newCollect.workAddress')
                  : I18n.t('screens.newCollect.clientAddress')
              }>
              {controller.obra.endereco && controller.obra.endereco.rua ? (
                <Styles.EnderecoClienteTexto>{enderecoFormatado(controller.obra.endereco) ?? ''}</Styles.EnderecoClienteTexto>
              ) : (
                <Styles.EnderecoClienteTexto>{enderecoFormatado(controller.cliente.endereco) ?? ''}</Styles.EnderecoClienteTexto>
              )}
            </ItemContainer>
          )}
          {controller.KMFinalValido && (
            <Styles.BotaoContainer>
              <Botao
                texto={I18n.t('screens.newCollect.button')}
                hasIcon={false}
                backgroundColor={colors.orange}
                corTexto={secundary}
                onPress={controller.novaColeta}
              />
            </Styles.BotaoContainer>
          )}
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
};

export default TelaNovaColeta;
