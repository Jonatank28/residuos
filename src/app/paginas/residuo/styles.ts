import styled from 'styled-components/native';

interface IInput {
  flex?: number;
  height: number;
  marginRight?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const ResiduoMessageContainer = styled.View`
  position: absolute;
  top: -40px;
  right: -5px;
  padding: 2px 5px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.primary};
`;

export const DuplicadoMensagemContainer = styled.View`
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const CheckBoxesContainer = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const RowContainer = styled.View`
  flex-direction: row;
`;

export const BalancaContainer = styled.TouchableOpacity`
  padding: 10px;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  margin-left: 5px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.primary};
`;

export const InputContainer = styled.View`
  width: 100%;
`;

export const ResiduoSecundarioContainer = styled.View`
  flex-direction: row;
`;

export const CheckContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const BotaoContainer = styled.View`
  margin-top: 10px;
`;

export const Input = styled.TextInput<IInput>`
  flex: ${(props) => props.flex ?? 1};
  padding: 10px;
  width: 100%;
  color: ${(props) => props.theme.text.input.color};
  margin-right: ${(props) => `${props.marginRight ?? 0}px`};
  margin-left: ${(props) => `${props.marginLeft ?? 0}px`};
  margin-top: ${(props) => `${props.marginTop ?? 0}px`};
  margin-bottom: ${(props) => `${props.marginBottom ?? 0}px`};
  border-radius: 5px;
  margin-bottom: 10px;
  min-height: ${(props) => `${props.height}px`};
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => !props.editable ? '#F1F1F1' : props.theme.card.background};
`;

export const Descricao = styled.Text`
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

export const DuplicadoTexto = styled.Text`
  color: ${(props) => props.theme.card.background};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;
