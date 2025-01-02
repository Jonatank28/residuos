import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IContainer {
  temErro: boolean;
  editavel?: boolean;
  backgroundColor?: string;
  borderLeftUp: number;
  borderRightUp: number;
  borderLeftDown: number;
  borderRightDown: number;
  marginTop: number;
  marginBottom: number;
  marginRight: number;
  marginLeft: number;
}

export const Container = styled.View<IContainer>`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  padding-left: 10px;
  border-top-left-radius: ${(props) => `${props.borderLeftUp}px`};
  border-top-right-radius: ${(props) => `${props.borderRightUp}px`};
  border-bottom-left-radius: ${(props) => `${props.borderLeftDown}px`};
  border-bottom-right-radius: ${(props) => `${props.borderRightDown}px`};
  border-color: ${(props) => props.theme.colors.accent};
  border-width: ${(props) => `${props.temErro ? 1 : 0}px`};
  margin-top: ${(props) => `${props.marginTop}px`};
  margin-bottom: ${(props) => `${props.marginBottom}px`};
  margin-right: ${(props) => `${props.marginRight}px`};
  margin-left: ${(props) => `${props.marginLeft}px`};
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => !props.editavel ? '#F1f1f1' : props.backgroundColor ?? props.theme.card.background};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const Input = styled.TextInput`
  flex: 1;
  height: 40px;
  padding-left: 10px;
  width: 100%;
  color: ${(props) => props.theme.text.input.color};
  /* background-color: ${(props) => !props.editable ? props.theme.card.border : props.theme.text.input.background}; */
`;

export const ErroFormContainer = styled.View`
  align-items: flex-end;
  padding-right: 8px;
  margin-top: 5px;
`;

export const ErroFormTexto = styled.Text`
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;
