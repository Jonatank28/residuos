import styled from 'styled-components/native';

interface Container {
  marginTop: number;
  marginBottom: number;
  marginRight: number;
  marginLeft: number;
  hasBorder?: boolean;
  backgroundColor?: string;
}

export const Container = styled.TouchableOpacity<Container>`
  margin-top: ${props => `${props.marginTop}px`};
  margin-bottom: ${props => `${props.marginBottom}px`};
  margin-right: ${props => `${props.marginRight}px`};
  margin-left: ${props => `${props.marginLeft}px`};
  padding: 10px;
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-between;
  border-width: ${props => `${props.hasBorder ? 1 : 0}px`};
  border-color: ${props => props.theme.card.border};
  background-color: ${props => props.backgroundColor ?? props.theme.card.background};
`;

export const Titulo = styled.Text`
  color: ${props => props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: ${props => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${props => props.theme.text.body1.color};
  font-weight: ${props => props.theme.text.body1.fontWeight};
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
`;

export const TituloContainer = styled.View`
  flex: 0.7;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
`;

export const DescricaoContainer = styled.View`
  flex: 0.3;
  justify-content: center;
  align-items: flex-end;
`;
