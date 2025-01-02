import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Constants from 'expo-constants';
import { RNCamera } from 'react-native-camera';

export const Container = styled(RNCamera)`
  flex: 1;
  background-color: transparent;
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const VoltarContainer = styled.TouchableOpacity`
  padding: 0px 10px 10px 10px;
`;

export const HeaderContainer = styled.View`
  flex: 0.1;
  padding-left: 20px;
  padding-top: ${`${30 + Constants.statusBarHeight}px`};
`;

export const BodyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const FotoContainer = styled.View`
  flex: 1;
  width: 85%;
  border-radius: 10px;
  margin-bottom: 20px;
  border-width: 2px;
  border-color: ${(props) => props.theme.colors.white};
`;

export const FooterContainer = styled.View`
  flex: 0.3;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const FooterIconContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding: 10px;
`;

export const TakeCircularContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${(props) => props.theme.colors.white};
`;

export const TakeCircularSmallContainer = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  background-color: ${(props) => props.theme.colors.white};
`;

export const Botao = styled.TouchableOpacity`
  border-radius: 10px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.white};
`;

export const Mensagem = styled.Text`
  color: ${(props) => props.theme.colors.white};
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
