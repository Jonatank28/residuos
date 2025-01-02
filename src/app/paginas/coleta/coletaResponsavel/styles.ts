import styled from 'styled-components/native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ITitle {
  required?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const SemConteudoContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const DeleteContainer = styled.TouchableOpacity`
  flex: 0.2;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: ${(props) => props.theme.colors.accent};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const TextoMtrContainer = styled.View`
  flex: 1;
  padding: 15px 10px;
`;

export const MtrContainerExterno = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const MtrRelacaoContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const AwesomeIcone = styled(AwesomeIcon)``;

export const IconContainer = styled.TouchableOpacity`
  flex: 0.2;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${(props) => props.theme.primary};
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const ResumoContainer = styled.View``;

export const DadosContainer = styled.View`
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const MTRContainer = styled.View`
  flex-direction: row;
`;

export const BotaoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const Titulo = styled.Text<ITitle>`
  margin-bottom: 5px;
  color: ${(props) => (props.required ? props.theme.colors.accent : props.theme.text.body1.color)};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.subhead.color};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;

export const MensagemAlertaValorOS = styled.Text`
  text-align: center;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;
