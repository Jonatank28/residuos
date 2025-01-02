import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import Botao from '../../componentes/botao';
import { Checkbox } from 'react-native-paper';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';
import Cabecalho from '../../componentes/cabecalho';
import { useTheme } from 'styled-components/native';
import CartaoSimples from '../../componentes/cartaoSimples';
import { useUser } from '../../contextos/usuarioContexto';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AdicionarFoto, formatterCurrency, ItemContainer } from 'vision-common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheetGaleria from '../../componentes/bottomSheetGaleria';
import Decimal from 'decimal.js';

const TelaResiduo: IScreenAuth<AuthRoutes.Residuo> = ({ navigation, route }) => {
    const { primary, secundary, colors, text, card } = useTheme();
    const controller = Controller({ navigation, params: route.params });
    const { configuracoes } = useUser();

    return (
        <>
            <Cabecalho
                titulo={route.params.isEdit ? I18n.t('screens.residue.titleEdit') : I18n.t('screens.residue.titleAdd')}
                temIconeDireita={false}
            />
            <Styles.Container>
                {route.params.duplicado && (
                    <Styles.DuplicadoMensagemContainer>
                        <Styles.Titulo>{I18n.t('screens.residue.attention')}</Styles.Titulo>
                        <Styles.Descricao>{I18n.t('screens.residue.attentionMessage')}</Styles.Descricao>
                    </Styles.DuplicadoMensagemContainer>
                )}
                <Styles.ScrollContainer onScroll={controller.dimissKeyboard} scrollEventThrottle={0} keyboardShouldPersistTaps="always">
                    <ItemContainer title={I18n.t('screens.residue.residueInfo')} marginBottom={10}>
                        {(route.params.duplicado || route.params.adicionado) && (
                            <Styles.ResiduoMessageContainer>
                                <Styles.DuplicadoTexto>
                                    {route.params.duplicado ? I18n.t('screens.residue.double') : I18n.t('screens.residue.added')}
                                </Styles.DuplicadoTexto>
                            </Styles.ResiduoMessageContainer>
                        )}
                        <CartaoSimples
                            hasBorder
                            descricao={String(controller.residuo?.codigo) ?? I18n.t('screens.residue.residueCode')}
                            nomeIcone="chevron-right"
                            naoTemIcone={route.params.isEdit}
                            backgroundColor={route.params.isEdit ? '#F1F1F1' : ''}
                            onPress={route.params.isEdit ? () => null : controller.navigateToResiduos}
                            marginBottom={10}
                        />
                        <Styles.Input
                            height={50}
                            maxLength={100}
                            placeholderTextColor={text.input.placeholderColor}
                            value={controller.residuo?.descricao ?? ''}
                            onChangeText={controller.onChangeDescricaoResiduos}
                            editable={configuracoes.alteraDescricaoResiduo}
                        />
                        <CartaoSimples
                            naoTemIcone
                            hasBorder
                            descricao={controller.residuo?.subGrupo ?? ''}
                            backgroundColor="#F1f1f1"
                            marginBottom={10}
                        />
                        {configuracoes?.mostrarValoresOSResiduos && (
                            <CartaoSimples
                                naoTemIcone
                                hasBorder
                                backgroundColor="#F1f1f1"
                                descricao={formatterCurrency(controller.residuo?.valorUnitario ?? 0, { prefix: 'R$ ', precision: 2 })}
                                marginBottom={10}
                            />
                        )}
                        <Styles.RowContainer>
                            <Styles.Input
                                height={50}
                                maxLength={10}
                                ref={controller.inputRef}
                                onFocus={controller.onFocusQuantidade}
                                onBlur={controller.onBlurQuantidade}
                                placeholderTextColor={text.input.placeholderColor}
                                value={String(controller.residuo?.quantidade ?? '')}
                                placeholder={I18n.t('screens.residue.amount')}
                                keyboardType={controller.residuo.xExigeInteiro ? 'numeric' : 'decimal-pad'}
                                onChangeText={controller.onChangeQuantidade}
                                editable={
                                    !controller.balancaSocket.conectando &&
                                    !controller.residuo.preCadastroReferencia &&
                                    !(controller.residuo?.residuosSecundarios && controller.residuo?.residuosSecundarios?.length > 0)
                                }
                            />
                            <Styles.BalancaContainer
                                onPress={
                                    controller.balancaSocket.conectando ||
                                        (controller.residuo?.residuosSecundarios && controller.residuo?.residuosSecundarios?.length > 0)
                                        ? () => null
                                        : () => controller.verificarQuantidadeBalancas(false)
                                }
                                activeOpacity={
                                    controller.balancaSocket.conectando ||
                                        (controller.residuo?.residuosSecundarios && controller.residuo?.residuosSecundarios?.length > 0)
                                        ? 1
                                        : 0.5
                                }>
                                {controller.balancaSocket.conectando ? (
                                    <CustomActiveIndicator color="#FFF" />
                                ) : (
                                    <MaterialCommunityIcons name="scale-balance" size={26} color="#FFF" />
                                )}
                            </Styles.BalancaContainer>
                            <Styles.BalancaContainer
                                onPress={
                                    controller.balancaSocket.conectando ||
                                        (controller.residuo?.residuosSecundarios && controller.residuo?.residuosSecundarios?.length > 0)
                                        ? () => null
                                        : () => controller.verificarQuantidadeBalancas(true)
                                }
                                activeOpacity={
                                    controller.balancaSocket.conectando ||
                                        (controller.residuo?.residuosSecundarios && controller.residuo?.residuosSecundarios?.length > 0)
                                        ? 1
                                        : 0.5
                                }>
                                {controller.balancaSocket.conectando ? (
                                    <CustomActiveIndicator color="#FFF" />
                                ) : (
                                    <MaterialCommunityIcons name="plus" size={26} color="#FFF" />
                                )}
                            </Styles.BalancaContainer>
                        </Styles.RowContainer>
                        {configuracoes.mostraImobilizadoTelaResiduosAPP &&
                            <>
                                <Styles.Descricao>{'Adicionar imobilizado'}</Styles.Descricao>
                                <CartaoSimples
                                    hasBorder
                                    descricao={controller.imobilizado?.descricao || 'Equipamento'}
                                    nomeIcone="plus"
                                    naoTemIcone={false}
                                    backgroundColor={''}
                                    onPress={controller.goToEquipamentos}
                                    marginBottom={10}
                                />
                                <Styles.Descricao>{'Peso Final'}</Styles.Descricao>
                                <CartaoSimples
                                    hasBorder
                                    descricao={`${controller.calculaPesoFinaldoOs()}`}
                                    backgroundColor={controller.calculaPesoFinaldoOs() > 0 ? "#F1f1f1" : "#F1f1f1"}
                                    naoTemIcone
                                    marginBottom={10}
                                    corTexto={controller.calculaPesoFinaldoOs() > 0 ? "#000" : "#000"}
                                />
                            </>
                        }
                        <Styles.RowContainer>
                            <Styles.Input
                                flex={1}
                                marginRight={5}
                                height={50}
                                editable={false}
                                placeholderTextColor={text.headline.color}
                                value="Unidade"
                            />
                            <Styles.Input
                                flex={1}
                                height={50}
                                editable={false}
                                placeholderTextColor={text.headline.color}
                                value={controller.residuo?.unidade ?? ''}
                                placeholder={controller.residuo?.unidade ?? ''}
                            />
                        </Styles.RowContainer>
                        {controller.residuo?.residuosSecundarios && controller.residuo?.residuosSecundarios?.length > 0 && (
                            <>
                                <Styles.RowContainer>
                                    <Styles.Input
                                        flex={1}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value="Imobilizado Real"
                                    />
                                    <Styles.Input
                                        flex={0.6}
                                        marginLeft={5}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value={String(controller.residuo?.codigoImobilizadoReal ?? '')}
                                    />
                                </Styles.RowContainer>
                                <Styles.RowContainer>
                                    <Styles.Input
                                        flex={1}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value="Peso Bruto"
                                    />
                                    <Styles.Input
                                        flex={0.6}
                                        marginLeft={5}
                                        height={50}
                                        keyboardType="decimal-pad"
                                        editable={true}
                                        onChangeText={controller.onChangePesoBruto}
                                        placeholderTextColor={text.headline.color}
                                        value={new Decimal(String(controller.residuo.pesoBruto ?? '').replace(',', '.')).toFixed(controller.numeroCasasDecimais).toString()}
                                        placeholder={String(controller.residuo.pesoBruto ?? '')}
                                    />
                                </Styles.RowContainer>
                                <Styles.RowContainer>
                                    <Styles.Input
                                        flex={1}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value="Peso Líquido"
                                    />
                                    <Styles.Input
                                        flex={0.6}
                                        marginLeft={5}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value={controller.calculaPesoLiquidoResiduo().toString()}
                                        placeholder={controller.calculaPesoLiquidoResiduo().toString()}
                                    />
                                </Styles.RowContainer>
                                <Styles.RowContainer>
                                    <Styles.Input flex={1} height={50} editable={false} placeholderTextColor={text.headline.color} value="Tara" />
                                    <Styles.Input
                                        flex={0.6}
                                        marginLeft={5}
                                        marginRight={5}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value={String(controller.residuo.tara ?? '')}
                                        placeholder={String(controller.residuo.tara ?? '')}
                                    />
                                    <Styles.Input
                                        flex={1}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value="Excesso"
                                    />
                                    <Styles.Input
                                        flex={0.6}
                                        marginLeft={5}
                                        height={50}
                                        editable={false}
                                        placeholderTextColor={text.headline.color}
                                        value={controller.calculaPesoExcesso().toString()}
                                        placeholder={controller.calculaPesoExcesso().toString()}
                                    />
                                </Styles.RowContainer>
                            </>
                        )}
                        <Styles.Input
                            multiline
                            autoCorrect
                            height={100}
                            maxLength={300}
                            editable={true}
                            textAlignVertical="top"
                            placeholderTextColor={text.input.placeholderColor}
                            value={controller.residuo?.observacao}
                            placeholder={I18n.t('screens.residue.observation')}
                            onChangeText={controller.onChangeObservacao}
                        />
                        <Styles.CheckBoxesContainer>
                            <Styles.CheckContainer activeOpacity={0.5} onPress={controller.onChangeExcesso}>
                                <Checkbox
                                    color={colors.orange}
                                    uncheckedColor={card.border}
                                    status={controller.residuo?.excesso ? 'checked' : 'unchecked'}
                                />
                                <Styles.Descricao>{I18n.t('screens.residue.excess')}</Styles.Descricao>
                            </Styles.CheckContainer>
                            <Styles.CheckContainer activeOpacity={0.5} onPress={controller.onChangeConforme}>
                                <Checkbox
                                    color={colors.accent}
                                    uncheckedColor={card.border}
                                    status={controller.residuo?.naoConforme ? 'checked' : 'unchecked'}
                                />
                                <Styles.Descricao>{I18n.t('screens.residue.notAccording')}</Styles.Descricao>
                            </Styles.CheckContainer>
                        </Styles.CheckBoxesContainer>
                    </ItemContainer>
                    {Boolean(controller.residuo?.xImobilizadoGenerico) &&
                        controller.residuo.residuosSecundarios &&
                        controller.residuo.residuosSecundarios?.length > 0 && (
                            <ItemContainer title="Resíduos Coletados" marginBottom={10}>
                                {controller.residuo.residuosSecundarios.map((_residuoSecundario, index) => (
                                    <Styles.RowContainer key={String(index)}>
                                        <Styles.Input
                                            flex={0.6}
                                            height={50}
                                            style={{
                                                fontSize: 10,
                                            }}
                                            editable={false}
                                            placeholderTextColor={text.headline.color}
                                            value={_residuoSecundario.descricao ?? ''}
                                            placeholder={_residuoSecundario.descricao ?? ''}
                                        />
                                        <Styles.Input
                                            height={50}
                                            flex={0.2}
                                            maxLength={10}
                                            marginLeft={5}
                                            marginRight={5}
                                            placeholderTextColor={text.input.placeholderColor}
                                            value={String(_residuoSecundario?.quantidade ?? '')}
                                            keyboardType="decimal-pad"
                                            onChangeText={text => controller.onChangeQuantidadeResiduoSecundario(text, index)}
                                            editable={true}
                                        />
                                        <Styles.Input
                                            flex={0.2}
                                            height={50}
                                            editable={false}
                                            placeholderTextColor={text.headline.color}
                                            value={_residuoSecundario.unidade ?? ''}
                                            placeholder={_residuoSecundario.unidade ?? ''}
                                        />
                                    </Styles.RowContainer>
                                ))}
                            </ItemContainer>
                        )}
                    <AdicionarFoto
                        title={I18n.t('screens.residue.addPhotos')}
                        photos={controller.photos}
                        mensagem={I18n.t('screens.residue.addPhotos')}
                        screen={AuthRoutes.Residuo}
                        onPressDelete={photos => controller.setPhotos(photos)}
                        onPressAdicionar={() =>
                            configuracoes.naoMostrarOpcaoGaleriaAoAnexarFoto ?
                                controller.goToCamera() :
                                controller.bottomSheetRef.current?.present()
                        }
                        maxPhotos={20}
                    />
                    <Styles.BotaoContainer>
                        <Botao
                            texto={route.params.isEdit ? I18n.t('screens.residue.save') : I18n.t('screens.residue.add')}
                            backgroundColor={primary}
                            corTexto={secundary}
                            onPress={controller.onPressConfirmar}
                            disable={controller.isButtonDisabled
                                || controller.calculaPesoFinaldoOs() < 0
                                || controller.validaQuantidade()}
                        />
                    </Styles.BotaoContainer>
                </Styles.ScrollContainer>

                <BottomSheetGaleria
                    bottomSheetRef={controller.bottomSheetRef}
                    goToCamera={controller.goToCamera}
                    goToGaleraFotos={controller.goToGaleraFotos}
                />
            </Styles.Container>
        </>
    );
};

export default TelaResiduo;
