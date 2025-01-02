import styled from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

interface IContainer {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  hasBorder?: boolean;
}

export const Container = styled(DropDownPicker)<IContainer>`
  border: none;
  min-height: 45px;
  margin-top: ${(props) => `${props.marginTop}px`};
  margin-bottom: ${(props) => `${props.marginBottom}px`};
  margin-left: ${(props) => `${props.marginLeft}px`};
  margin-right: ${(props) => `${props.marginRight}px`};
  border-radius: 5px;
  border-color: ${(props) => props.theme.border.color};
  border-width: ${(props) => `${props.hasBorder ? 1 : 0}px`};
  background-color: ${(props) => props.backgroundColor ?? props.theme.card.background};
`;
