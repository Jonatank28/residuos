import styled from 'styled-components/native';

interface ITitulo {
  marginTop?: number;
  marginBottom?: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 20
  },
})``;

export const Input = styled.TextInput`
  min-height: 50px;
  padding: 10px 20px;
  width: 100%;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.text.input.background};
`;

export const BotaoContainer = styled.View`
  margin: 30px 20px;
`;

export const Titulo = styled.Text<ITitulo>`
  margin-top: ${(props) => `${props.marginTop ?? 0}px`};
  margin-bottom: ${(props) => `${props.marginBottom ?? 0}px`};
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
