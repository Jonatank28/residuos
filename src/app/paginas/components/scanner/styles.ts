import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { RNCamera } from 'react-native-camera';
import Constants from 'expo-constants';

interface IBorderContainer {
  borderColor?: boolean;
}

export const Container = styled(RNCamera)`
  flex: 1;
  background-color: transparent;
`;

export const BorderContainer = styled.View<IBorderContainer>`
  border-width: 1px;
  width: 90%;
  border-color: ${(props) => (props.borderColor ? props.theme.colors.accent : props.theme.primary)};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const VoltarContainer = styled.TouchableOpacity`
  padding: 0px 20px 0px 10px;
`;

export const HeaderContainer = styled.View`
  flex: 0.1;
  padding-left: 20px;
  padding-bottom: 10px;
  padding-top: ${`${30 + Constants.statusBarHeight}px`};
`;

export const BodyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ScannerContainer = styled.View`
  flex: 1;
  width: 85%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 20px;
  border-width: 2px;
  border-color: ${(props) => props.theme.secundary};
`;

export const FooterContainer = styled.View`
  flex: 0.3;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const Botao = styled.TouchableOpacity`
  border-radius: 10px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.icon.color};
`;

export const MessageContainer = styled.View`
  margin-left: 20px;
  margin-right: 20px;
`;

export const Mensagem = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.secundary};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const TextoBotao = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;
