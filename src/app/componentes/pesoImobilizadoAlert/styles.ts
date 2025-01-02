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

export const ImagemContainer = styled.View`
  height: 125px;
  width: 125px;
  margin-bottom: 30px;
`;

export const Imagem = styled.Image`
  width: 100%;
  height: 100%;
`;

export const PesoContainer = styled.View`
  width: 100%;
`;

export const IconeContainer = styled.View`
  width: 20%;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${props => props.theme.primary};
`;

export const ContainerColuna = styled.View`
 flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${props => props.theme.border.color};
`;

export const Input = styled.TextInput`
  width: 80%;
  padding: 10px;
  background-color: ${(props) => props.theme.text.input.background};
`;

export const Inicial = styled.View`
  margin-bottom: 10px;
`;

export const CheckContainer = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const PesoBrutoTaraContainer = styled.View`
  flex: 1;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export const LabelPularPesagem = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const LabelTaraPesagem = styled.Text`
  text-align: center;  
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: 16px;
`;

export const Label = styled.Text`
  margin-bottom: 2px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
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

export const Modal = styled.Modal``;

export const BotaoContainer = styled.TouchableOpacity<{ ativo?: boolean }>`
  padding: 15px 20px;
  position: absolute;
  bottom: 0; left: 0; right: 0;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.ativo ? props.theme.primary : props.theme.border.color};
`;

export const BotaoTexto = styled.Text`
  color: ${(props) => props.theme.text.button.color};
  font-weight: ${(props) => props.theme.text.button.fontWeight};
  font-family: ${(props) => props.theme.text.button.fontFamily};
  font-size: ${(props) => props.theme.text.button.fontSize};
`;