import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import { formatterCurrency, somenteNumeros } from 'vision-common';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useColeta } from '../../contextos/coletaContexto';
import { Keyboard } from 'react-native';

const KmAlert = (props: Props) => {
  const { text } = useTheme();
  const { veiculo } = useColeta();

  const kmInicialInvalido = (): boolean => Boolean(veiculo.kmFinal && props?.kmInicial && props.kmInicial < veiculo.kmFinal);

  const kmFinalInvalido = (): boolean => Boolean(props.kmFinal && props?.kmInicial && props.kmFinal < props.kmInicial);

  const onClose = () => {
    Keyboard.dismiss();
    props.onPressClose();
  };

  const onPress = () => {
    onClose();
    props.onPressBotao();
  };

  return (
    <>
      <Styles.Modal transparent animationType="fade" visible={props.active}>
        <Styles.Container>
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            {/*Comentado botao de fechar modal pois salvava rascunho errado - refatorar*/}
            {/* <Styles.BotaoFecharContainer onPress={onClose}>
              <FontAwesome name="close" size={32} />
            </Styles.BotaoFecharContainer> */}
            <Styles.ImagemContainer>
              <Styles.Imagem source={require('../../assets/imagens/estrada.png')} />
            </Styles.ImagemContainer>
            <Styles.Titulo>Quilometragem do Caminhão</Styles.Titulo>
            <Styles.Descricao>Informe a quilometragem inicial e a final durante a coleta</Styles.Descricao>
            <Styles.KmContainer>
              <Styles.Label>Inicial</Styles.Label>
              <Styles.KmInicial>
                <Styles.ContainerColuna>
                  <Styles.KMIconeContainer>
                    <FontAwesome name="flag-checkered" size={22} color="#FFF"></FontAwesome>
                  </Styles.KMIconeContainer>
                  <Styles.KMInput
                    value={formatterCurrency(props.kmInicial || 0)}
                    placeholderTextColor={text.input.placeholderColor}
                    placeholder="0"
                    maxLength={10}
                    onChangeText={text => props.setKmInicial(somenteNumeros(text))}
                    keyboardType="number-pad"
                  />
                </Styles.ContainerColuna>
                {kmInicialInvalido() && (
                  <Styles.MensagemErro>A quilometragem deve ser maior que a última utilizada</Styles.MensagemErro>
                )}
              </Styles.KmInicial>
              <Styles.Label>Final</Styles.Label>
              <Styles.KmFinal>
                <Styles.ContainerColuna>
                  <Styles.KMIconeContainer>
                    <FontAwesome5 name="route" size={22} color="#FFF"></FontAwesome5>
                  </Styles.KMIconeContainer>
                  <Styles.KMInput
                    value={formatterCurrency(props.kmFinal || 0)}
                    placeholderTextColor={text.input.placeholderColor}
                    placeholder="0"
                    maxLength={10}
                    onChangeText={text => props.setKmFinal(somenteNumeros(text))}
                    keyboardType="number-pad"
                  />
                </Styles.ContainerColuna>
                {kmFinalInvalido() && <Styles.MensagemErro>A quilometragem deve ser maior que a inicial</Styles.MensagemErro>}
              </Styles.KmFinal>
            </Styles.KmContainer>
          </Styles.ScrollContainer>
          <Styles.BotaoContainer
            ativo={!kmInicialInvalido() && !kmFinalInvalido()}
            activeOpacity={!kmInicialInvalido() && !kmFinalInvalido() ? 0.5 : 1}
            onPress={!kmInicialInvalido() && !kmFinalInvalido() ? onPress : () => null}>
            <Styles.BotaoTexto>Continuar</Styles.BotaoTexto>
          </Styles.BotaoContainer>
        </Styles.Container>
      </Styles.Modal>
    </>
  );
};

type Props = {
  active: boolean;
  kmInicial?: number;
  kmFinal?: number;
  setKmInicial: (km: number) => void;
  setKmFinal: (km: number) => void;
  onPressBotao: () => void;
  onPressClose: () => void;
};

export default KmAlert;
