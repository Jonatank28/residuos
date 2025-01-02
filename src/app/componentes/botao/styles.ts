import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IContainer {
  backgroundColor?: string;
  hasBorder?: boolean;
  disabled?: boolean;
}


interface IText {
  textColor?: string;
}

export const Container = styled.TouchableOpacity<IContainer>`
  flex: 1;
  min-height: 50px;
  border-radius: 5px;
  position: relative;
  align-items: center;
  justify-content: center;
  border-width: ${(props) => `${props.hasBorder ? 1 : 0}px`};
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.disabled ? props.theme.border.color : props.backgroundColor ?? props.theme.button.background};
`;

export const FeatherIcone = styled(FeatherIcon)`
  position: absolute;
  top: 10px;
  left: 20px;
`;

export const TextoBotao = styled.Text<IText>`
  color: ${(props) => props.textColor ?? props.theme.text.button.color};
  font-weight: ${(props) => props.theme.text.button.fontWeight};
  font-family: ${(props) => props.theme.text.button.fontFamily};
  font-size: ${(props) => props.theme.text.button.fontSize};
`;
