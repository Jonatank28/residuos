import { Switch } from 'react-native-paper';
import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface INaoColetadoTituloContainer {
  noCollected?: boolean;
}

interface IOpcaoMapaContainer {
  hasBorderBottom?: boolean;
}

interface IClienteHeaderContainer {
  hasBorder?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const NaoColetadoTituloContainer = styled.View<INaoColetadoTituloContainer>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${(props) => `${props.noCollected ? 10 : 0}px`};
`;

export const CartaoColetaContainer = styled.View`
  flex: 1;
  border-radius: 5px;
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const MaterialCommunityIcone = styled(MaterialCommunityIcons)``;

export const NaoColetadoBodyContainer = styled.View``;

export const NaoColetadoContainer = styled.View`
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.card.background};
`;

export const IconeMapaContainer = styled.View`
  flex:0.2;
  align-items: center;
  justify-content: center;
`;

export const TextoMapaContainer = styled.View`
  flex:0.8;
  padding-left: 10px;
  align-items:flex-start;
  justify-content:center;
`;

export const OpcaoMapaContainer = styled.TouchableOpacity<IOpcaoMapaContainer>`
  width:90%;
  flex-direction: row;
  padding: 10px;
  border-bottom-color: ${(props) => props.theme.card.border};
  border-bottom-width: ${(props) => `${props.hasBorderBottom ? 1 : 0}px`};
`;

export const RowContainer = styled.View`
  padding: 10px 20px;
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const BotaoNaoColetado = styled(Switch)``;

export const KMContainer = styled.View`
  flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
`;

export const MensagemErro = styled.Text`
  color: ${(props) => props.theme.colors.accent};
  font-weight: 700;
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const KMBotaoContainer = styled.TouchableOpacity`
  width: 15%;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.primary};
`;

export const KMIconeContainer = styled.View`
width: 15%;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

export const KMInput = styled.TextInput`
  width: 70%;
  padding: 10px;
  background-color: ${(props) => props.theme.text.input.background};
`;

export const Input = styled.TextInput`
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  min-height: 100px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.text.input.background};
`;

export const ClienteContainer = styled.View`
  flex: 1;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const ClienteHeaderContainer = styled.TouchableOpacity<IClienteHeaderContainer>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-color: ${(props) => props.theme.card.border};
  border-bottom-width: ${(props) => `${props.hasBorder ? 1 : 0}px`};
`;

export const ClienteHeaderTextoContainer = styled.View`
  flex: 0.8;
  padding: 10px 10px 10px 20px;
`;

export const ClienteHeaderIconContainer = styled.View`
  padding: 10px;
  align-items: center;
  justify-content: center;
`;

export const ClienteBodyContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ClienteFooterContainer = styled.TouchableOpacity`
  flex: 0.5;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: ${(props) => props.theme.card.border};
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const BotaoContainer = styled.View`
  margin-top: 30px;
`;

export const DescricaoCheckinClienteContainer = styled.TouchableOpacity`
  padding-top: 5px;
  align-items: center;
  justify-content: center;
`;

export const DescricaoContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text<{ flex?: boolean; bold?: boolean }>`
  ${props => props.flex && 'flex: 1;'}
  ${props => props.bold && 'font-weight: 900;'}
  color: ${(props) => props.theme.text.body1.color};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const DescricaoCheckin = styled.Text`
  text-align: center;
  padding-top: 2px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const DescricaoLocalizacao = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
