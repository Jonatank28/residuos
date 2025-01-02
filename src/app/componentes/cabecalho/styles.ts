import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

interface IContainer {
  hasBorderBottom?: boolean;
  background?: string;
}

export const Container = styled.View<IContainer>`
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom-color: ${(props) => props.theme.border.color};
  border-bottom-width: ${(props) => (props.hasBorderBottom ? '1px' : '0px')};
  background-color: ${(props) => props.background ?? props.theme.primary};
`;

export const OfflineContainer = styled.View`
  height: 4px;
  background-color: ${(props) => props.theme.colors.orange};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const AwesomeIcone = styled(AwesomeIcon)``;

export const BotaoEsquerdoContainer = styled.TouchableOpacity`
  flex: 0.2;
  padding: 15px 0px 15px 0px;
  align-items: center;
`;

export const TituloContainer = styled.View`
  flex: 1;
`;

export const Titulo = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.secundary};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const BotaoDireitoContainer = styled.View`
  flex: 0.2;
  padding: 15px 0px 15px 0px;
  align-items: center;
`;
