import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px 10px 0px 10px;
  background-color: ${(props) => props.theme.background};
`;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 40px;
`;

export const RegiaoContainer = styled.TouchableOpacity`
  padding: 15px 20px;
  border-radius: 5px;
  justify-content: center;
  background-color: ${(props) => props.theme.card.background};
`;

export const Titulo = styled.Text`
  text-transform: uppercase;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;
