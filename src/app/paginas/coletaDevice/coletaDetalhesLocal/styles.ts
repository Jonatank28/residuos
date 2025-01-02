import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IClienteContainer {
  hasBorder?: boolean;
}

interface IDescricaoMtrGeradoContainer {
  isOnline: boolean;
}

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

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const FotoRowContainer = styled.View`
  gap: 10px;
  flex-wrap: wrap;
  flex-direction: row;
`;

export const FotoContainer = styled.TouchableOpacity`
  width: 40px;
  margin-right: 10px;
  height: 40px;
  margin-bottom: 5px;
`;

export const Foto = styled.Image`
  flex: 1;
  height: 100%;
  border-radius: 5px;
  width: 100%;
`;

export const ModalFoto = styled.Modal``;

export const FotoModalContainer = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

export const ModalContainer = styled.View`
  position: relative;
  margin: 80px 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const FecharModalContainer = styled.TouchableOpacity`
  padding: 5px;
  border-width: 1px;
  margin: 10px;
  border-color: ${(props) => props.theme.card.border};
  border-radius: 5px;
  position: absolute;
  top: 0px;
  right: 0px;
`;

export const CartaoColetaContainer = styled.View`
  flex: 1;
`;

export const ClienteContainer = styled.View`
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const ClienteBodyContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

export const DescricaoMtrGeradoContainer = styled.View<IDescricaoMtrGeradoContainer>`
  padding: 3px 5px;
  border-radius: 5px;
  position: absolute;
  top: -10px;
  right: -5px;
  background-color: ${(props) => props.isOnline ? props.theme.colors.green : props.theme.colors.orange};
`;

export const DescricaoMtrGeradoCardContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const MtrContainer = styled.TouchableOpacity`
  border-radius: 5px;
  width: 100%;
  position: relative;
  margin-bottom: 10px;
  padding: 10px 20px;
  min-height: 50px;
  justify-content: center;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const InputContainer = styled.View`
  border-radius: 5px;
  width: 100%;
  position: relative;
  margin-bottom: 10px;
  padding: 10px 20px;
  min-height: 50px;
  justify-content: center;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const Spacer = styled.View`
  height: 10px;
  width: 10px;
`;

export const BotaoCheckoutContainer = styled.View`
  flex-direction: row;
  align-self: flex-end;
  margin-top: 10px;
`;

export const BotaoCheckout = styled.Button``;

export const KMContainer = styled.View`
  flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  margin-bottom: 10px;
  border-color: ${props => props.theme.border.color};
`;

export const TempoColetaContainer = styled.View`
  flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  margin-bottom: 10px;
  border-color: ${(props) => props.theme.border.color};
`;

export const KMIconeContainer = styled.View`
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
  width: 15%;
`;

export const TempoColetaIconeContainer = styled.View`
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
  width: 15%;
`;

export const ContainerHoraEBotoes = styled.View``;

export const KMInput = styled.TextInput`
  width: 85%;
  padding: 10px;
  background-color: ${(props) => props.theme.text.input.background};
`;

export const TempoColeta = styled.TextInput`
  width: 85%;
  padding: 10px;
  background-color: ${props => props.theme.text.input.background};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const ClienteHeaderContainer = styled.TouchableOpacity<IClienteContainer>`
  padding: 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-color: ${(props) => props.theme.card.border};
  border-bottom-width: ${(props) => `${props.hasBorder ? 1 : 0}px`};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CheckoutContainer = styled.View`
  flex-direction: row;
`;

export const EnderecoTexto = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const TituloInput = styled.Text`
  margin-bottom: 5px;
  margin-left: 10px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: 14px;
`;

export const TituloCheckin = styled.Text`
  margin-bottom: 5px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: 14px;
`;

export const TituloKmTotalColeta = styled.Text`
  color: ${props => props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: 14px;
`;

export const Descricao = styled.Text<{ flex?: boolean; bold?: boolean }>`
  ${props => props.flex && 'flex: 1;'}
  ${props => props.bold && 'font-weight: 900;'}
  color: ${(props) => props.theme.text.body1.color};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const TextoMtrGerado = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;
