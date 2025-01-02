import styled from 'styled-components/native';

interface IOpcaoTexto {
  color?: string;
}

export const Container = styled.View`
  margin-top: 10px;
  position: relative;
  background-color: ${(props) => props.theme.card.background};
  `;

export const RowContainer = styled.View<{paddingTop?: number}>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${props =>  `${props.paddingTop ?? 0}px`};
`;

export const EtapaContainer = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 2px 3px;
  border-bottom-left-radius: 5px;
  background-color: ${props => props.theme.primary};
`;

export const EtapaTexto = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;

export const DetalhesContainer = styled.View`
  padding: 5px;
  padding: 10px;
`;

export const SubstituirContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-bottom-left-radius: 5px;
  border-top-width: 1px;
  border-color: ${(props) => props.theme.card.border};
`;

export const RetirarContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-bottom-right-radius: 5px;
  border-top-width: 1px;
  border-left-width: 1px;
  border-color: ${(props) => props.theme.card.border};
`;

export const Titulo = styled.Text`
  margin: 10px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body2.color};
  font-weight: ${(props) => props.theme.text.body2.fontWeight};
  font-family: ${(props) => props.theme.text.body2.fontFamily};
  font-size: ${(props) => props.theme.text.body2.fontSize};
`;

export const OpcoesTexto = styled.Text<IOpcaoTexto>`
  color: ${(props) => props.color ?? props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;
