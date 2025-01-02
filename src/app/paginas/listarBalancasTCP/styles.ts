import styled from 'styled-components/native';

export const TituloSheetContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0px;
  margin-bottom: 5px;
`;

export const Row = styled.View`
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 10px;
`;

export const BotoesContainer = styled.View`
`;

export const Spacer = styled.View`
  height: 5px;
`;

export const InputContainer = styled.View<{ width?: number; paddingRight?: number; paddingLeft?: number }>`
  width: ${(props) => `${props.width ?? 100}%`};
  padding-right: ${(props) => `${props.paddingRight ?? 0}px`};
  padding-left: ${(props) => `${props.paddingLeft ?? 0}px`};
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: 10px;
  color: ${(props) => props.theme.text.input.color};
  border-radius: 5px;
  min-height: 50px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const Container = styled.SafeAreaView`
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

export const ItemBalancaContainer = styled.TouchableOpacity`
  position: relative;
  padding: 15px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const ItemBalancaSincronizadoContainer = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 2px 4px;
  border-top-right-radius: 5px;
  background-color: ${props => props.theme.primary};
`;

export const ItemBalancaSincronizadoTexto = styled.Text`
  color: ${props => props.theme.colors.white};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;

export const ItemBalancaTexto = styled.Text``;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Error = styled.Text`
  padding-top: 5px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: 14px;
`;

export const Label = styled.Text`
  padding-bottom: 5px;
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
