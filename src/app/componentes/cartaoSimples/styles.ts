import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IContainer {
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  hasBorder?: boolean;
}

interface IDescricao {
  cor?: string;
}

export const Container = styled.TouchableOpacity<IContainer>`
  flex-direction: row;
  border-radius: 5px;
  min-height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => `${props.marginTop}px`};
  margin-bottom: ${(props) => `${props.marginBottom}px`};
  margin-left: ${(props) => `${props.marginLeft}px`};
  margin-right: ${(props) => `${props.marginRight}px`};
  border-color: ${(props) => props.theme.card.border};
  border-width: ${(props) => `${props.hasBorder ? 1 : 0}px`};
  background-color: ${(props) => props.backgroundColor ?? props.theme.card.background};
`;

export const DescricaoContainer = styled.View`
  flex: 1;
`;

export const IconContainer = styled.View`
  flex: 0.1;
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const Descricao = styled.Text<IDescricao>`
  color: ${(props) => props.cor ?? props.theme.text.input.color};
  font-weight: ${(props) => props.theme.text.input.fontWeight};
  font-family: ${(props) => props.theme.text.input.fontFamily};
  font-size: ${(props) => props.theme.text.input.fontSize};
`;
