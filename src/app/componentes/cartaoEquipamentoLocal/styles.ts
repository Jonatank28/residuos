import styled from 'styled-components/native';

interface Container {
  marginTop: number;
  marginBottom: number;
  marginRight: number;
  marginLeft: number;
  backgroundColor?: string;
}

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Container = styled.TouchableOpacity<Container>`
  margin-top: ${(props) => `${props.marginTop}px`};
  margin-bottom: ${(props) => `${props.marginBottom}px`};
  margin-right: ${(props) => `${props.marginRight}px`};
  margin-left: ${(props) => `${props.marginLeft}px`};
  padding: 10px;
  flex-direction: row;
  border-radius: 5px;
  border-color: ${(props) => props.theme.border.color};
  border-width: 1px;
  background-color: ${(props) => props.backgroundColor ?? props.theme.card.background};
`;
export const TituloContainer = styled.View`
  flex:0.8;
  align-items: flex-start;
  justify-content: center;
`;

export const DescricaoContainer = styled.View`
  flex: 0.2;
  align-items: flex-end;
  justify-content: center;
`;
