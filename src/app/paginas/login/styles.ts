import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ICaixaTextoContainer {
  marginBottom?: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.primary};
`;

export const CaixaTextoContainer = styled.View<ICaixaTextoContainer>`
  height: 40px;
  margin-bottom: ${(props) => `${props.marginBottom ?? 20}px`};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 20,
  },
})``;

export const LogoContainer = styled.View`
  align-items: center;
  padding-top: ${(_) => `${Dimensions.get('screen').height > 800 ? 100 : 50}px`};
  padding-bottom: 30px;
  justify-content: center;
`;

export const LoginContainer = styled.View``;

export const Logo = styled.Image`
  width: 120px;
  height: 120px;
`;

export const DesenvolvidoContainer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0px;
  align-items: center;
  justify-content: center;
`;

export const VisionTextoBotao = styled.View``;

export const VisionImageContainer = styled.View``;

export const VisionImage = styled.Image`
  max-height: 60px;
  max-width: 200px;
`;

export const ConfiguracoesContainer = styled.TouchableOpacity`
  align-items: center;
  margin-top: 20px;
  justify-content: center;
  border-radius: 10px;
  padding: 12px;
  background-color: ${(props) => props.theme.secundary};
`;

export const BotoesContainer = styled.View`
  align-items: center;
`;

export const BotaoContainer = styled.View`
  width: 100%;
  height: 50px;
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const DesenvolvidoPor = styled.Text`
  color: ${(props) => props.theme.secundary};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;
