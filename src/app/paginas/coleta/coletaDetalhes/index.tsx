import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { ItemContainer, SemConteudo, BottomModal, formatterCurrency, somenteNumeros } from 'vision-common';
import Botao from '../../../componentes/botao';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoColeta from '../../../componentes/cartaoColeta';
import CartaoSimples from '../../../componentes/cartaoSimples';
import { useOffline } from '../../../contextos/offilineContexto';
import { AuthRoutes } from '../../../routes/routes';
import { enderecoFormatado } from '../../../utils/formatter';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../../routes/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TelaColetaDetalhes: IScreenAuth<AuthRoutes.DetalhesDaColeta> = ({ navigation, route }) => {
  const { offline } = useOffline();
  const { text, colors, primary, card, secundary, icon } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={route.params.coletaID ?? ''} onPressIconeEsquerda={controller.goBackFunction} temIconeDireita={false} />
      <Styles.Container>
        <BottomModal
          title={I18n.t('screens.collectDetails.location.title')}
          active={controller.showModalMapa}
          onPressIcone={() => controller.setShowModalMapa()}>
          <Styles.OpcaoMapaContainer activeOpacity={0.5} hasBorderBottom onPress={() => controller.abrirMapa('waze')}>
            <Styles.IconeMapaContainer>
              <Styles.MaterialCommunityIcone name="waze" size={40} color={icon.color} />
            </Styles.IconeMapaContainer>
            <Styles.TextoMapaContainer>
              <Styles.Titulo>{I18n.t('screens.collectDetails.location.waze')}</Styles.Titulo>
            </Styles.TextoMapaContainer>
          </Styles.OpcaoMapaContainer>
          <Styles.OpcaoMapaContainer activeOpacity={0.5} onPress={() => controller.abrirMapa('maps')}>
            <Styles.IconeMapaContainer>
              <Styles.FeatherIcone name="map-pin" size={30} color={icon.color} />
            </Styles.IconeMapaContainer>
            <Styles.TextoMapaContainer>
              <Styles.Titulo>{I18n.t('screens.collectDetails.location.maps')}</Styles.Titulo>
            </Styles.TextoMapaContainer>
          </Styles.OpcaoMapaContainer>
        </BottomModal>
        {!controller.loadingData ? (
          controller?.coleta?.codigoOS ? (
            <Styles.ScrollContainer
              scrollEventThrottle={0}
              keyboardShouldPersistTaps="always"
              onScroll={controller.dimissKeyboard}>
              <Styles.CartaoColetaContainer>
                <CartaoColeta
                  isDetails
                  codigoOS={controller.coleta.codigoOS}
                  dataOS={controller.coleta.dataOS}
                  status={controller.coleta.classificacaoOS}
                />
              </Styles.CartaoColetaContainer>
              {!offline &&
                (!controller.isLocalizacao ? (
                  <Styles.RowContainer>
                    <Styles.Titulo>{I18n.t('screens.collectDetails.locationSharingStart')}</Styles.Titulo>
                    <Styles.BotaoNaoColetado
                      value={!!(controller?.compartilharLocalizacao && controller.compartilharLocalizacao?.length > 0)}
                      thumbColor={primary}
                      children={undefined}
                      onChange={undefined}
                      trackColor={{
                        false: card.border,
                        true: primary,
                      }}
                      onValueChange={controller.onToggleCompartilharLocalizacao}
                    />
                  </Styles.RowContainer>
                ) : controller.compartilharLocalizacao === String(controller.coleta?.codigoOS ?? '') ? (
                  <Styles.RowContainer>
                    <Styles.Titulo>{I18n.t('screens.collectDetails.locationSharingStop')}</Styles.Titulo>
                    <Styles.BotaoNaoColetado
                      value={controller?.compartilharLocalizacao?.length > 0}
                      thumbColor={primary}
                      children={undefined}
                      onChange={undefined}
                      trackColor={{
                        false: card.border,
                        true: primary,
                      }}
                      onValueChange={controller.onToggleCompartilharLocalizacao}
                    />
                  </Styles.RowContainer>
                ) : (
                  <Styles.RowContainer>
                    <Styles.DescricaoLocalizacao>
                      {I18n.t('screens.collectDetails.locationSharingExist')}
                    </Styles.DescricaoLocalizacao>
                  </Styles.RowContainer>
                ))}
              {/* // Adicionar parada agendada*/}
              <Styles.Container>
                <Styles.NaoColetadoContainer>
                  <CartaoSimples
                    hasBorder
                    descricao={I18n.t('screens.collectDetails.addstop')}
                    nomeIcone="chevron-right"
                    onPress={controller.navigateToListStops}
                    marginBottom={10}
                  />
                </Styles.NaoColetadoContainer>
              </Styles.Container>
              <Styles.NaoColetadoContainer>
                <Styles.NaoColetadoTituloContainer noCollected={controller.naoColetado}>
                  <Styles.Titulo>{I18n.t('screens.collectDetails.notCollected')}</Styles.Titulo>
                  <Styles.BotaoNaoColetado
                    value={controller.naoColetado}
                    thumbColor={colors.accent}
                    children={undefined}
                    onChange={undefined}
                    trackColor={{
                      false: card.border,
                      true: colors.accent,
                    }}
                    onValueChange={controller.onToggleNaoColetado}
                  />
                </Styles.NaoColetadoTituloContainer>
                {controller.naoColetado && (
                  <Styles.NaoColetadoBodyContainer>
                    <CartaoSimples
                      hasBorder
                      descricao={route.params.motivo.descricao ?? I18n.t('screens.collectDetails.selectReason')}
                      nomeIcone="chevron-right"
                      onPress={controller.navigateToMotivos}
                      marginBottom={10}
                    />
                    <Styles.Input
                      multiline
                      autoCorrect
                      maxLength={255}
                      textAlignVertical="top"
                      placeholderTextColor={text.input.placeholderColor}
                      value={controller.observacoes}
                      placeholder={I18n.t('screens.collectDetails.observation')}
                      onChangeText={controller.setObservacoes}
                    />
                  </Styles.NaoColetadoBodyContainer>
                )}
              </Styles.NaoColetadoContainer>
              {controller.coleta.mtr !== null && controller.coleta.mtr !== '' && (
                <CartaoSimples descricao={controller.coleta.mtr ?? ''} nomeIcone="hash" marginBottom={10} />
              )}
              <ItemContainer
                title={I18n.t('screens.collectDetails.address')}
                marginBottom={10}
                hasIcon
                nomeIcone="map-pin"
                onPress={() => {
                  controller.setShowModalMapa();
                }}>
                <Styles.Descricao>{enderecoFormatado(controller?.coleta?.enderecoOS)}</Styles.Descricao>
              </ItemContainer>

              <ItemContainer title="Quilometragem Inicial" marginBottom={10}>
                <Styles.KMContainer>
                  <Styles.KMIconeContainer>
                    <FontAwesome name="flag-checkered" size={22}></FontAwesome>
                  </Styles.KMIconeContainer>
                  <Styles.KMInput
                    value={formatterCurrency(controller.coleta.KMInicial || 0)}
                    placeholderTextColor={text.input.placeholderColor}
                    placeholder="0"
                    maxLength={10}
                    onChangeText={text => controller.setKmColeta(somenteNumeros(text))}
                    keyboardType="number-pad"
                  />
                  <Styles.KMBotaoContainer onPress={controller.setarUltimoKm}>
                    <FontAwesome5 name="sync" size={22} color="#FFF"></FontAwesome5>
                  </Styles.KMBotaoContainer>
                </Styles.KMContainer>
                {controller.validarKmInicial() && (
                  <Styles.MensagemErro>
                    A quilometragem é inválida, clique no botão ao lado para pegar a última coletada ou do veiculo
                  </Styles.MensagemErro>
                )}
              </ItemContainer>

              <Styles.ClienteContainer>
                <Styles.ClienteHeaderContainer
                  activeOpacity={0.5}
                  hasBorder={controller.coleta.codigoObra !== 0}
                  onPress={controller.navigateToCliente}>
                  <Styles.ClienteHeaderTextoContainer>
                    <Styles.Titulo>
                      {controller?.coleta?.nomeCliente
                        ? `${controller?.coleta?.codigoCliente ?? ''} - ${controller.coleta.nomeCliente.toUpperCase()}`
                        : ''}
                    </Styles.Titulo>
                  </Styles.ClienteHeaderTextoContainer>
                  <Styles.ClienteHeaderIconContainer>
                    <Styles.FeatherIcone name="chevron-right" size={25} />
                  </Styles.ClienteHeaderIconContainer>
                </Styles.ClienteHeaderContainer>
                {controller.coleta.codigoObra !== 0 && (
                  <Styles.ClienteBodyContainer>
                    <Styles.Row>
                      <Styles.Descricao bold>{I18n.t('screens.collectDetails.work')}</Styles.Descricao>
                      <Styles.Descricao flex numberOfLines={1} ellipsizeMode="tail">
                        {controller.coleta.nomeObra ?? '-'}
                      </Styles.Descricao>
                    </Styles.Row>
                    <Styles.Row>
                      <Styles.Descricao bold>{I18n.t('screens.collectDetails.contract')}</Styles.Descricao>
                      <Styles.Descricao flex>{controller.coleta.codigoContratoObra ?? '-'}</Styles.Descricao>
                    </Styles.Row>
                  </Styles.ClienteBodyContainer>
                )}
                {controller.coleta.telefoneCliente !== '' && (
                  <Styles.ClienteFooterContainer
                    activeOpacity={0.5}
                    onPress={() => controller.showPhoneAlert(controller?.coleta?.telefoneCliente ?? '')}>
                    <Styles.Descricao>{I18n.t('screens.collectDetails.callCustomer')}</Styles.Descricao>
                  </Styles.ClienteFooterContainer>
                )}
              </Styles.ClienteContainer>
              <Styles.BotaoContainer>
                {controller.checkIn === null ? (
                  <>
                    <Botao
                      texto={I18n.t('screens.collectDetails.checkIn')}
                      backgroundColor={colors.green}
                      corTexto={colors.white}
                      disable={controller.realizandoCheckinCheckout}
                      onPress={controller.fazerCheckInAsync}
                    />
                    {controller.validarCheckinOS() && (
                      <Styles.DescricaoCheckin>Para continuar realize o check in</Styles.DescricaoCheckin>
                    )}
                  </>
                ) : !controller.isCheckIn ? (
                  <>
                    <Styles.DescricaoContainer>
                      <Styles.Descricao>{`O Cliente ${controller.checkIn} está com checkin ativo`}</Styles.Descricao>
                    </Styles.DescricaoContainer>
                    <Botao
                      texto={'Fazer Checkout'}
                      backgroundColor={colors.accent}
                      corTexto={secundary}
                      disable={controller.realizandoCheckinCheckout}
                      onPress={() => controller.fazerCheckOutAsync(controller.checkIn)}
                    />
                  </>
                ) : (
                  <Botao
                    texto={I18n.t('screens.collectDetails.checkOut')}
                    backgroundColor={colors.accent}
                    corTexto={secundary}
                    disable={controller.realizandoCheckinCheckout}
                    onPress={() => controller.fazerCheckOutAsync()}
                  />
                )}
                <Styles.Spacer />
                {controller.naoColetado && route.params.motivo?.codigo && (
                  <>
                    <Botao
                      texto={I18n.t('screens.collectDetails.responsible')}
                      corTexto={secundary}
                      disable={controller.validarCheckinOS() && !controller.realizandoCheckinCheckout}
                      onPress={controller.navigateToVerificarColeta}
                    />
                    <Styles.Spacer />
                  </>
                )}
                <Botao
                  texto={I18n.t('screens.collectDetails.button')}
                  backgroundColor={colors.orange}
                  corTexto={secundary}
                  disable={controller.validarCheckinOS() && !controller.realizandoCheckinCheckout}
                  onPress={controller.continuarColeta}
                />
              </Styles.BotaoContainer>
            </Styles.ScrollContainer>
          ) : (
            <Styles.SemConteudoContainer>
              <SemConteudo texto={I18n.t('screens.collectDetails.notFound')} nomeIcone="file" />
            </Styles.SemConteudoContainer>
          )
        ) : (
          <Styles.SemConteudoContainer>
            <CustomActiveIndicator />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container >
    </>
  );
};

export default TelaColetaDetalhes;
