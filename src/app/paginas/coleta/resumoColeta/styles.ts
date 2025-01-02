import styled from 'styled-components/native';

interface IClienteContainer {
  hasBorder?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const BotaoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const ClienteContainer = styled.View`
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const ClienteBodyContainer = styled.View`
  padding: 10px;
`;

export const ClienteHeaderContainer = styled.View<IClienteContainer>`
  padding: 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-color: ${(props) => props.theme.card.border};
  border-bottom-width: ${(props) => `${props.hasBorder ? 1 : 0}px`};
`;

export const CartaoSubResiduo = styled.View``;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PrintOptionContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const TotalEquipamentosContainer = styled.View`
  align-self: center;
  margin-bottom: 8px;
`;

export const TotalEquipamentosAlocados = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
  font-weight: 900;
  text-transform: uppercase;
`;

export const Descricao = styled.Text<{ flex?: boolean; bold?: boolean }>`
  margin-top: 5px;
  ${props => props.flex && 'flex: 1;'}
  ${props => props.bold && 'font-weight: 900;'}
  color: ${(props) => props.theme.text.body1.color};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const MensagemAlertaValorOS = styled.Text`
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;