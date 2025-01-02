import { Switch } from 'react-native-paper';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px 10px 0px 10px;
  background-color: ${(props) => props.theme.background};
`;

export const BotaoContainersLocal = styled(Switch)``;

export const ListaContainersHeader = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
`;

export const LocalContainersContainer = styled.View`
  min-height: 50px;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.card.background};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

