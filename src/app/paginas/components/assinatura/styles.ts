import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Constants from 'expo-constants';

interface ITexto {
  hasSecundary?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: red;
  background-color: ${(props) => props.theme.background};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const VoltarContainer = styled.TouchableOpacity`
  position: absolute;
  z-index: 1;
  left: 30px;
  top: ${`${10 + Constants.statusBarHeight}px`};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const FooterContainer = styled.View`
  flex: 0.2;
  align-items: center;
  flex-direction: row;
`;

export const Botao = styled.Button``;

export const BotaoContainer = styled.View`
  flex: 0.2;
  align-items: center;
  justify-content: flex-start;
`;

export const DescricaoAssinaturaContainer = styled.View`
  flex: 0.6;
  align-items: center;
  justify-content: flex-start;
`;

export const Image = styled.Image`
  max-width: 650px;
  opacity: 0.5;
  max-height: 400px;
`;

export const ImprimirContainer = styled.TouchableOpacity`
  position: absolute;
  padding: 10px;
  z-index: 1;
  right: 20px;
  border-radius: 5px;
  top: ${`${Constants.statusBarHeight}px`};
  background-color: ${(props) => props.theme.button.background};
`;

export const RecusaAssinaturaContainer = styled.TouchableOpacity`
  position: absolute;
  padding: 8px;
  z-index: 1;
  right: 60px;
  border-radius: 5px;
  top: ${`${Constants.statusBarHeight}px`};
  background-color: ${(props) => props.theme.colors.accent};
`;

export const TextoRecusaAsssinatra = styled.Text`
  color: #FFF;
  text-align: center;
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Texto = styled.Text<ITexto>`
  color: ${(props) => (props.hasSecundary ? props.theme.secundary : props.theme.text.body1.color)};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const ImageContainer = styled.View`
  height: 100%;
  width: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
`;
