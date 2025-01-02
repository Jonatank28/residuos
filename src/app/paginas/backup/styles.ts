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

export const BotaoContainer = styled.View`
  margin-top: 30px;
`;

export const Input = styled.TextInput`
  min-height: 50px;
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  color: ${(props) => props.theme.text.input.color};
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.text.input.background};
`;

export const Titulo = styled.Text`
  padding: 10px 0px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;
