import * as React from 'react';
import * as Styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Keyboard } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Checkbox } from 'react-native-paper';
import Decimal from 'decimal.js';
import { useUser } from '../../contextos/usuarioContexto';

const PesoImobilizadoAlert = (props: Props) => {
    const { text, colors, card } = useTheme();
    const [pesoBruto, setPesoBruto] = React.useState<string>('0');
    const [pularPesagem, setPularPesagem] = React.useState<boolean>(false);
    const { configuracoes } = useUser();


    const onClose = () => {
        Keyboard.dismiss();
        props.onPressClose();
        setPesoBruto('0');
        setPularPesagem(false);
    };

    const onPress = () => {
        onClose();

        if (pularPesagem) {
            props.onPressMovimentarSemPeso();
        } else {
            props.onPressContinuar(pesoBruto);
        }

        setPularPesagem(false);
    };

    const validarPesoBrutoETara = () => {
        if (Boolean(pesoBruto && pesoBruto !== '0' && pesoBruto.length > 0)) {
            const pesoBrutoTratado = new Decimal(pesoBruto.replace(',', '.'));
            const taraTratada = new Decimal(String(props.tara).replace(',', '.'));

            return pesoBrutoTratado.comparedTo(taraTratada) < 0 || pesoBrutoTratado.equals(taraTratada)

        }

        return false;
    }

    const validarPesoBruto = (): boolean => {
        if (pularPesagem) return true;

        return Boolean(pesoBruto && pesoBruto !== '0' && pesoBruto.length > 0) && new Decimal(pesoBruto.replace(',', '.')).comparedTo(new Decimal(String(props.tara).replace(',', '.'))) > 0;
    };

    const onChangeQuantidade = (quantidade: string) => {
        let newQuantidade = quantidade.trim();

        newQuantidade === '.'
            ? newQuantidade = '0,'
            : newQuantidade = newQuantidade.replace(/ /g, '').replace('-', '').replace('.', ',');

        // Aplicar o número de casas decimais configurado
        if (newQuantidade.includes(',')) {
            const [integerPart, decimalPart] = newQuantidade.split(',');
            newQuantidade = `${integerPart},${decimalPart.slice(0, configuracoes.numeroCasasDecimaisResiduos)}`;
        }
        setPesoBruto(newQuantidade);
    };


    const onFocusQuantidade = () =>
        setPesoBruto(
            parseFloat(pesoBruto && pesoBruto?.length > 0 ? pesoBruto : '0') === 0 ? '' : String(pesoBruto ?? '').replace(/ /g, ''),
        );

    const onBlurQuantidade = () => setPesoBruto(!pesoBruto ? '0' : String(pesoBruto ?? '').replace(/ /g, ''));

    return (
        <>
            <Styles.Modal transparent animationType="fade" visible={props.active}>
                <Styles.Container>
                    <Styles.ScrollContainer keyboardShouldPersistTaps="always">
                        <Styles.BotaoFecharContainer onPress={onClose}>
                            <FontAwesome name="close" size={32} />
                        </Styles.BotaoFecharContainer>
                        <Styles.ImagemContainer>
                            <Styles.Imagem source={require('../../assets/imagens/pesagem.png')} />
                        </Styles.ImagemContainer>
                        <Styles.Titulo>Peso Bruto</Styles.Titulo>
                        <Styles.Descricao>Informe o peso bruto do imobilizado</Styles.Descricao>
                        <Styles.PesoContainer>
                            <Styles.Label>Peso Bruto</Styles.Label>
                            <Styles.Inicial>
                                <Styles.ContainerColuna>
                                    <Styles.IconeContainer>
                                        <FontAwesome name="balance-scale" size={22} color="#FFF"></FontAwesome>
                                    </Styles.IconeContainer>
                                    <Styles.Input
                                        value={pesoBruto}
                                        placeholderTextColor={text.input.placeholderColor}
                                        maxLength={10}
                                        editable={!pularPesagem}
                                        onFocus={onFocusQuantidade}
                                        onBlur={onBlurQuantidade}
                                        onChangeText={onChangeQuantidade}
                                        keyboardType="number-pad"
                                    />
                                </Styles.ContainerColuna>
                            </Styles.Inicial>
                            <Styles.CheckContainer activeOpacity={0.5} onPress={() => setPularPesagem(prev => !prev)}>
                                <Checkbox color={colors.accent} uncheckedColor={card.border} status={pularPesagem ? 'checked' : 'unchecked'} />
                                <Styles.LabelPularPesagem>Pular Pesagem e Somente Movimentar</Styles.LabelPularPesagem>
                            </Styles.CheckContainer>
                        </Styles.PesoContainer>
                        {validarPesoBrutoETara() && (
                            <Styles.PesoBrutoTaraContainer>
                                <Styles.LabelTaraPesagem>Peso bruto deve ser maior que a tara do equipamento: {props.tara}</Styles.LabelTaraPesagem>
                            </Styles.PesoBrutoTaraContainer>
                        )}
                    </Styles.ScrollContainer>
                    <Styles.BotaoContainer
                        ativo={validarPesoBruto()}
                        activeOpacity={validarPesoBruto() ? 0.5 : 1}
                        onPress={validarPesoBruto() ? onPress : () => null}>
                        <Styles.BotaoTexto>Continuar</Styles.BotaoTexto>
                    </Styles.BotaoContainer>
                </Styles.Container>
            </Styles.Modal>
        </>
    );
};

type Props = {
    active: boolean;
    tara: number;
    onPressContinuar: (pesoBruto: string) => void;
    onPressMovimentarSemPeso: () => void;
    onPressClose: () => void;
};

export default PesoImobilizadoAlert;
