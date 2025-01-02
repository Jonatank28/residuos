import styled from 'styled-components/native';

export const TituloSheetContainer = styled.TouchableOpacity`
  padding: 5px 0px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BottomSheetItem = styled.TouchableOpacity`
  padding: 18px;
  border-radius: 5px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.card.border};
  background-color: ${props => props.theme.card.background};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const BottomSheetItemTexto = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;