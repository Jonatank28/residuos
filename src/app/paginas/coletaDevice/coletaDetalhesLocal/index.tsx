import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { formatterCurrency, IPhoto, ItemContainer } from 'vision-common';
import { IMtr } from '../../../../core/domain/entities/mtr';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoColeta from '../../../componentes/cartaoColeta';
import CartaoSimples from '../../../componentes/cartaoSimples';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { useUser } from '../../../contextos/usuarioContexto';
import { AuthRoutes } from '../../../routes/routes';
import { enderecoFormatado } from '../../../utils/formatter';
import { IScreenAuth } from '../../../routes/types';
import DateTimePicker, { DatePickerIOS } from 'vision-common/src/app/componentes/datepicker';
import { useTheme } from 'styled-components/native';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TelaColetaDetalhesLocal: IScreenAuth<AuthRoutes.DetalhesDaColetaLocal> = ({ navigation, route }) => {
  const { configuracoes } = useUser();
  const { primary, text } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.collectDetailsLocal.title')}
        nomeIconeDireita="download-cloud"
        onPressIconeDireita={controller.showMtrGeradoAlert}
        temIconeDireita={(configuracoes?.hasMTR && !controller?.coleta.isOffline) ?? false}
      />
      <Styles.Container>
        <Styles.ModalFoto transparent visible={controller.visivel}>
          <Styles.ModalContainer>
            <Styles.FotoModalContainer
              source={{
                uri:
                  controller?.foto && controller.foto?.base64 && controller.foto?.base64.includes('data:image/jpg;base64,')
                    ? controller?.foto?.base64
                    : `data:image/jpg;base64,${controller?.foto?.base64}`,
              }}
              resizeMode="cover"
            />
            <Styles.FecharModalContainer activeOpacity={0.5} onPress={() => controller.setVisivel(false)}>
              <Styles.FeatherIcone name="x" size={25} />
            </Styles.FecharModalContainer>
          </Styles.ModalContainer>
        </Styles.ModalFoto>
        {!controller.loadingData ? (
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            {controller.coleta?.codigoOS !== 0 && (
              <Styles.CartaoColetaContainer>
                <CartaoColeta
                  isDetails
                  codigoOS={controller.coleta?.codigoOS}
                  dataOS={controller.coleta?.dataOS}
                  status={controller.coleta?.classificacaoOS}
                />
              </Styles.CartaoColetaContainer>
            )}
            <Styles.ClienteContainer>
              <Styles.ClienteHeaderContainer
                hasBorder={!!controller.coleta?.codigoObra}
                activeOpacity={0.5}
                onPress={controller.navigateToCliente}>
                <Styles.Titulo>
                  {controller?.coleta?.nomeCliente
                    ? `${controller?.coleta?.codigoCliente ?? ''} - ${controller.coleta.nomeCliente.toUpperCase()}`
                    : ''}
                </Styles.Titulo>
                <Styles.FeatherIcone name="chevron-right" size={25} />
              </Styles.ClienteHeaderContainer>
              {controller.coleta?.codigoObra !== 0 && (
                <Styles.ClienteBodyContainer>
                  <Styles.Row>
                    <Styles.Descricao bold>{I18n.t('screens.collectDetailsLocal.work')}</Styles.Descricao>
                    <Styles.Descricao flex numberOfLines={1} ellipsizeMode="tail">{controller.coleta?.nomeObra ?? ''}</Styles.Descricao>
                  </Styles.Row>
                  <Styles.Row>
                    <Styles.Descricao bold>{I18n.t('screens.collectDetailsLocal.contract')}</Styles.Descricao>
                    <Styles.Descricao flex>{controller.coleta?.codigoContratoObra ?? ''}</Styles.Descricao>
                  </Styles.Row>
                </Styles.ClienteBodyContainer>
              )}
            </Styles.ClienteContainer>

            {controller.checkinOS?.clienteID && (controller.configuracoes.alertaCheckoutOS || controller.configuracoes.checkOutAutomatico) && (
              <ItemContainer title="Dados Checkin / Checkout OS" marginBottom={10}>
                <Styles.TituloCheckin>Checkin</Styles.TituloCheckin>
                <DateTimePicker
                  noEditable={true}
                  inputColor="#f1f1f1"
                  value={controller.checkinOS?.dataCheckIn}
                  onChange={date => controller.setCheckinOS(prev => ({ ...prev, dataCheckIn: date }))}
                />
                <Styles.Spacer></Styles.Spacer>
                <Styles.TituloCheckin>Checkout</Styles.TituloCheckin>
                <DateTimePicker
                  noEditable={controller.configuracoes.bloqueiaEdicaoTempoColeta}
                  minDate={new Date(moment(controller.coleta.dataOS).toISOString())}
                  maxDate={new Date()}
                  value={controller.checkinOS.dataCheckOut}
                  onChange={date => controller.setCheckinOS(prev => ({ ...prev, dataCheckOut: date }))}
                />
                <Styles.ContainerHoraEBotoes>
                  <Styles.Spacer></Styles.Spacer>
                  <Styles.TituloCheckin>Tempo da coleta</Styles.TituloCheckin>
                  <Styles.TempoColetaContainer>
                    <Styles.TempoColetaIconeContainer>
                      <FontAwesome name="clock-o" size={22}></FontAwesome>
                    </Styles.TempoColetaIconeContainer>
                    <Styles.TempoColeta
                      value={controller.diferencaFormatada}
                      placeholderTextColor={text.input.placeholderColor}
                      placeholder="0"
                      maxLength={10}
                      editable={false}
                      keyboardType="number-pad"
                    />
                  </Styles.TempoColetaContainer>
                  <Styles.BotaoCheckoutContainer
                  >
                    <Styles.BotaoCheckout title="Resetar" onPress={controller.onPressResetarCheckin} disabled={controller.configuracoes.bloqueiaEdicaoTempoColeta} />
                    <Styles.Spacer></Styles.Spacer>
                    <Styles.BotaoCheckout title="Salvar" color={primary} onPress={controller.onPressSalvarCheckin} disabled={controller.configuracoes.bloqueiaEdicaoTempoColeta} />
                  </Styles.BotaoCheckoutContainer>
                </Styles.ContainerHoraEBotoes>
              </ItemContainer>
            )}
            <ItemContainer title="Quilometragem da Coleta" marginBottom={10}>
              <Styles.KMContainer>
                <Styles.KMIconeContainer>
                  <FontAwesome name="flag-checkered" size={22}></FontAwesome>
                </Styles.KMIconeContainer>
                <Styles.KMInput
                  value={formatterCurrency(controller.coleta.KMInicial || 0, { suffix: ' km' })}
                  placeholderTextColor={text.input.placeholderColor}
                  placeholder="0"
                  maxLength={10}
                  editable={false}
                  keyboardType="number-pad"
                />
              </Styles.KMContainer>
              <Styles.KMContainer>
                <Styles.KMIconeContainer>
                  <FontAwesome5 name="route" size={22}></FontAwesome5>
                </Styles.KMIconeContainer>
                <Styles.KMInput
                  value={formatterCurrency(controller.coleta.KMFinal || 0, { suffix: ' km' })}
                  placeholderTextColor={text.input.placeholderColor}
                  placeholder="0"
                  maxLength={10}
                  editable={false}
                  keyboardType="number-pad"
                />
              </Styles.KMContainer>
              <Styles.Spacer></Styles.Spacer>
              <Styles.TituloKmTotalColeta>km total da coleta</Styles.TituloKmTotalColeta>
              <Styles.TempoColetaContainer></Styles.TempoColetaContainer>
              <Styles.KMContainer>
                <Styles.KMIconeContainer>
                  <FontAwesome name="truck" size={22}></FontAwesome>
                </Styles.KMIconeContainer>
                <Styles.KMInput
                  value={formatterCurrency(controller.totalKM, { suffix: ' km' })}
                  placeholderTextColor={text.input.placeholderColor}
                  placeholder="0"
                  maxLength={25}
                  editable={false}
                  keyboardType="number-pad"
                />
              </Styles.KMContainer>
            </ItemContainer>
            <ItemContainer marginBottom={10} title={I18n.t('screens.collectDetailsLocal.collectAddress')}>
              <Styles.EnderecoTexto>{enderecoFormatado(controller.coleta?.enderecoOS) ?? ''}</Styles.EnderecoTexto>
            </ItemContainer>
            {controller.coleta?.fotos && controller.coleta?.fotos?.length > 0 && (
              <ItemContainer title={I18n.t('screens.collectDetailsLocal.photos')} marginBottom={10}>
                <Styles.FotoRowContainer>
                  {controller.coleta.fotos.map((foto: IPhoto, index: number) => (
                    <Styles.FotoContainer key={String(index)} activeOpacity={0.5} onPress={() => controller.onPressFoto(foto)}>
                      <Styles.Foto
                        source={{
                          uri:
                            foto?.base64 && foto.base64.includes('data:image/jpg;base64,')
                              ? foto.base64
                              : `data:image/jpg;base64,${foto?.base64}`,
                        }}
                        resizeMode="cover"
                      />
                    </Styles.FotoContainer>
                  ))}
                </Styles.FotoRowContainer>
              </ItemContainer>
            )}
            <ItemContainer title={I18n.t('screens.collectDetailsLocal.responsibleInfo')} marginBottom={10}>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.responsibleName')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.nomeResponsavel && controller.coleta.nomeResponsavel?.length > 0
                    ? controller.coleta?.nomeResponsavel
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.responsibleFunction')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.funcaoResponsavel && controller.coleta.funcaoResponsavel?.length > 0
                    ? controller.coleta?.funcaoResponsavel
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.responsibleEmail')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.emailResponsavel && controller.coleta.emailResponsavel?.length > 0
                    ? controller.coleta?.emailResponsavel
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.responsibleDocument')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.CPFCNPJResponsavel && controller.coleta.CPFCNPJResponsavel?.length > 0
                    ? controller.coleta?.CPFCNPJResponsavel
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              {configuracoes?.mostrarValoresOSResiduos && (
                <>
                  <Styles.TituloInput>Valor</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>
                      {formatterCurrency(controller.calcularValorOS() ?? 0, { prefix: 'R$ ', precision: 2 })}
                    </Styles.Descricao>
                  </Styles.InputContainer>
                </>
              )}
            </ItemContainer>
            <CartaoSimples
              nomeIcone="list"
              descricao={I18n.t('screens.collectDetailsLocal.residuesList')}
              marginBottom={10}
              onPress={controller.navigateToListaResiduos}
            />
            <CartaoSimples
              nomeIcone="list"
              descricao={I18n.t('screens.collectDetailsLocal.equipamentList')}
              marginBottom={10}
              onPress={controller.navigateToListaEquipamentos}
            />
            {controller.coleta?.mtrs && controller.coleta?.mtrs?.length > 0 && (
              <ItemContainer title={I18n.t('screens.collectDetailsLocal.mtrsDetails')} marginBottom={10}>
                {controller.coleta.mtrs.map((mtr: IMtr, index: number) => (
                  <Styles.MtrContainer
                    key={index.toString()}
                    activeOpacity={mtr?.estado && mtr.estado?.codigo ? 0.5 : 1}
                    onPress={mtr?.estado && mtr.estado?.codigo ? () => controller.verificarPDFGerado(mtr) : () => null}>
                    {mtr?.estado && mtr.estado?.codigo && (
                      <Styles.DescricaoMtrGeradoContainer isOnline={!!(mtr?.base64MtrOnline && mtr.base64MtrOnline?.length > 0)}>
                        <Styles.TextoMtrGerado>
                          {!!(mtr?.base64MtrOnline && mtr.base64MtrOnline?.length > 0)
                            ? I18n.t('screens.collectDetailsLocal.mtr.mtrOnline')
                            : I18n.t('screens.collectDetailsLocal.mtr.mtrOffline')}
                        </Styles.TextoMtrGerado>
                      </Styles.DescricaoMtrGeradoContainer>
                    )}
                    <Styles.Descricao>
                      {`${mtr.estado && !mtr.hasSinir ? mtr.estado.descricao : I18n.t('screens.collectDetailsLocal.sinir')} - ${!!(mtr?.mtr || mtr?.mtrCodBarras)
                        ? mtr?.mtr ?? mtr?.mtrCodBarras
                        : I18n.t('screens.collectDetailsLocal.mtr.notInformed')
                        }`}
                    </Styles.Descricao>
                  </Styles.MtrContainer>
                ))}
                <Styles.DescricaoMtrGeradoCardContainer>
                  <Styles.TextoMtrGerado>{I18n.t('screens.collectDetailsLocal.mtr.message')}</Styles.TextoMtrGerado>
                </Styles.DescricaoMtrGeradoCardContainer>
              </ItemContainer>
            )}
            <ItemContainer title={I18n.t('screens.collectDetailsLocal.reasonDetails')} marginBottom={10}>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.reason')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.motivo?.descricao && controller.coleta?.motivo?.descricao?.length > 0
                    ? controller.coleta?.motivo?.descricao
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.observation')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.motivo?.observacao && controller.coleta?.motivo?.observacao?.length > 0
                    ? controller.coleta?.motivo?.observacao
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
            </ItemContainer>
            <ItemContainer title={I18n.t('screens.collectDetailsLocal.additionalInfo')} marginBottom={10}>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.observation')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.observacaoOS && controller.coleta?.observacaoOS?.length > 0
                    ? controller.coleta?.observacaoOS
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.mtrOnline')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.mtr && controller.coleta?.mtr?.length > 0 ? controller.coleta?.mtr : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.collectDetailsLocal.board')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller.coleta?.placa && controller.coleta?.placa?.length > 0
                    ? controller.coleta?.placa
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
            </ItemContainer>
          </Styles.ScrollContainer>
        ) : (
          <Styles.LoadingContainer>
            <CustomActiveIndicator />
          </Styles.LoadingContainer>
        )}
      </Styles.Container>
      <DatePickerIOS />
    </>
  );
};

export default TelaColetaDetalhesLocal;
