import styled from 'styled-components/native';

interface IBotaoContainer {
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const DuplicadoMensagemContainer = styled.View`
  padding: 5px;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
`;

export const BotaoContainer = styled.View<IBotaoContainer>`
  flex-direction: row;
  margin-bottom: ${(props) => `${props.marginBottom ?? 0}px`};
  margin-top: ${(props) => `${props.marginTop ?? 0}px`};
  margin-left: ${(props) => `${props.marginLeft ?? 0}px`};
  margin-right: ${(props) => `${props.marginRight ?? 0}px`};
`;

export const ObservacoesContainer = styled.View`
  min-height: 80px;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${(props) => props.theme.card.background};
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  min-height: 80px;
  background-color: ${(props) => props.theme.text.input.background};
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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
