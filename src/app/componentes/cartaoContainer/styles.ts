import styled from 'styled-components/native';

export const Container = styled.View`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const RowContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TituloContainer = styled.View`
  padding: 5px 10px;
`;

export const DetalhesContainer = styled.View`
  padding: 5px;
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
