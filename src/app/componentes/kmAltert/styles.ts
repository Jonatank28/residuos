import styled from 'styled-components/native';

export const Container = styled.View`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: ${(props) => props.theme.card.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: true,
  contentContainerStyle: {
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
})``;

export const BotaoFecharContainer = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  padding: 5px 10px;
  top: 15px;
`;

export const KmContainer = styled.View`
  width: 100%;
`;

export const KMIconeContainer = styled.View`
  width: 20%;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${props => props.theme.primary};
`;

export const KmInicial = styled.View`
  margin-bottom: 10px;
`;

export const ContainerColuna = styled.View`
 flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${props => props.theme.border.color};
`;

export const KmFinal = styled.View``;

export const KMInput = styled.TextInput`
  width: 80%;
  padding: 10px;
  background-color: ${(props) => props.theme.text.input.background};
`;

export const Modal = styled.Modal``;

export const BotaoContainer = styled.TouchableOpacity<{ativo?: boolean}>`
  padding: 15px 20px;
  position: absolute;
  bottom: 0; left: 0; right: 0;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.ativo ? props.theme.primary : props.theme.border.color};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const ImagemContainer = styled.View`
  height: 125px;
  width: 125px;
  margin-bottom: 30px;
`;

export const Imagem = styled.Image`
  width: 100%;
  height: 100%;
`;

export const Descricao = styled.Text`
  margin-top: 10px;
  margin-bottom: 40px;
  text-align: center;
  color: ${(props) => props.theme.text.body2.color};
  font-weight: ${(props) => props.theme.text.body2.fontWeight};
  font-family: ${(props) => props.theme.text.body2.fontFamily};
  font-size: ${(props) => props.theme.text.body2.fontSize};
`;

export const MensagemErro = styled.Text`
  color: ${(props) => props.theme.colors.accent};
  font-weight: 700;
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const BotaoTexto = styled.Text`
  color: ${(props) => props.theme.text.button.color};
  font-weight: ${(props) => props.theme.text.button.fontWeight};
  font-family: ${(props) => props.theme.text.button.fontFamily};
  font-size: ${(props) => props.theme.text.button.fontSize};
`;

export const Label = styled.Text`
  margin-bottom: 2px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

