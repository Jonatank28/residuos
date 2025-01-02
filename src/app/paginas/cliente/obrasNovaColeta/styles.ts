import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: ${(props) => props.theme.background};
`;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 30px;
`;

export const CartaoObraContainer = styled.TouchableOpacity<{isSelected?: boolean}>`
  border-radius: 5px;
  padding: 10px 20px;
  background-color: ${(props) => props.isSelected ? props.theme.primary : props.theme.card.background};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text<{marginTop?: number}>`
  padding-top: ${(props) => `${props.marginTop ?? 10}px`};
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
