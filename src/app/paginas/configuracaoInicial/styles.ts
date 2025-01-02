import styled from 'styled-components/native';

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

export const Input = styled.TextInput<{ hasOK: boolean }>`
  min-height: 50px;
  padding: 10px 20px;
  border-radius: 5px;
  width: 100%;
  border-width: 1px;
  color: ${(props) => props.theme.text.input.color};
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.hasOK ? props.theme.text.input.background : props.theme.card.border};
`;

export const BotaoContainer = styled.View`
  margin-top: 30px;
`;

export const VersaoContainer = styled.View`
  padding-top: 10px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  padding: 10px 0px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const VersaoTexto = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
