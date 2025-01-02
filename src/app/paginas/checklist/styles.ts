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

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const GrupoContainer = styled.View`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const PerguntasContainer = styled.View`
  margin-top: 10px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${(props) => props.theme.card.border};
`;

export const Input = styled.TextInput<IInput>`
  flex: ${(props) => props.flex ?? 1};
  padding: 10px;
  margin-right: ${(props) => `${props.marginRight ?? 0}px`};
  margin-left: ${(props) => `${props.marginLeft ?? 0}px`};
  margin-top: ${(props) => `${props.marginTop ?? 0}px`};
  margin-bottom: ${(props) => `${props.marginBottom ?? 0}px`};
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.card.border};
  min-height: ${(props) => `${props.height}px`};
  background-color: ${(props) => props.theme.card.background};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body2.color};
  font-weight: ${(props) => props.theme.text.body2.fontWeight};
  font-family: ${(props) => props.theme.text.body2.fontFamily};
  font-size: ${(props) => props.theme.text.body2.fontSize};
`;
