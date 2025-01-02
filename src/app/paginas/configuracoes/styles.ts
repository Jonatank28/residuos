import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-paper';

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

export const BotaoOffiline = styled(Switch)``;

export const FeatherIcone = styled(FeatherIcon)`
    color: ${(props) => props.theme.icon.color};
`;

export const OpcaoContainer = styled.TouchableOpacity`
  min-height: 50px;
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.card.border};
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const VersaoContainer = styled.Pressable`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5px;
`;

export const OpcaoTexto = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const VersaoTexto = styled.Text`
  padding-bottom: 5px;
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
