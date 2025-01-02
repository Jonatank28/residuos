import { Switch } from 'react-native-paper';
import styled from 'styled-components/native';

interface INaoColetadoTituloContainer {
  noCollected?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const KMContainer = styled.View`
  flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
`;

export const MensagemErro = styled.Text`
  color: ${(props) => props.theme.colors.accent};
  font-weight: 700;
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const KMBotaoContainer = styled.TouchableOpacity`
  width: 15%;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.primary};
`;

export const KMIconeContainer = styled.View`
width: 15%;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

export const KMInput = styled.TextInput`
  width: 70%;
  padding: 10px;
  background-color: ${(props) => props.theme.text.input.background};
`;

export const NaoColetadoContainer = styled.View`
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const BotaoNaoColetado = styled(Switch)``;

export const BotaoContainer = styled.View`
  margin: 10px 0px;
`;

export const NaoColetadoTituloContainer = styled.View<INaoColetadoTituloContainer>`
  flex-direction: row;
  margin-bottom: ${(props) => `${props.noCollected ? 10 : 0}px`};
  align-items: center;
  justify-content: space-between;
`;

export const LoadingObraContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
`;

export const Input = styled.TextInput`
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  min-height: 100px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
  color: ${(props) => props.theme.text.input.color};
`;

export const EnderecoClienteTexto = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
