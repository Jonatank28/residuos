import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IRowContainer {
  flex?: number;
  isBottom?: boolean;
  justifyContent?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

interface IOpcaoContainer {
  backgroundColor?: string;
}

interface ITitulo {
  color?: string;
  fontSize?: number;
}

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props) => props.theme.card.background};
`;

export const FeatherIcone = styled(FeatherIcon)`
  color: ${(props) => props.theme.secundary};
`;

export const OpcaoContainer = styled.TouchableOpacity<IOpcaoContainer>`
  padding: 5px;
  margin: 0px 2px;
  border-radius: 5px;
  max-height: 25px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.backgroundColor ?? props.theme.colors.orange};
`;

export const StatusContainer = styled.View`
  width: 10px;
  background-color: ${(props) => props.theme.primary};
`;

export const ConteudoContainer = styled.View`
  flex: 1;
`;

export const PeriodicidadeContainer = styled.View`
  position: absolute;
  top: -10px;
  right: 10px;
  padding: 2px 4px;
  border-radius: 25px;
  background-color: ${(props) => props.theme.colors.green};
`;

export const Image = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.View`
  width: 45px;
  height: 45px;
  margin-right: 5px;
`;

export const TituloContainer = styled.View`
  flex: 1;
`;

export const DataContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;

export const RowContainer = styled.View<IRowContainer>`
  flex: ${(props) => props.flex ?? 1};
  justify-content: ${(props) => props.justifyContent ?? 'flex-start'};
  padding-right: ${(props) => `${props.marginRight ?? 10}px`};
  padding-left: ${(props) => `${props.marginLeft ?? 10}px`};
  padding-top: ${(props) => `${props.marginTop ?? 10}px`};
  padding-bottom: ${(props) => `${props.marginBottom ?? 10}px`};
  flex-direction: row;
  align-items: ${(props) => (props.isBottom ? 'center' : 'flex-start')};
`;

export const DescricaoTextoContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const RoteirizacaoContainer = styled.View`
  flex: 1;
  padding-left: 10px;
  padding-bottom: 5px;
`;

export const ColumnContainer = styled.View`
  flex: 1;
  padding: 0px 10px;
`;

export const HoraTexto = styled.Text<ITitulo>`
  color: ${(props) => props.theme.text.subhead.color};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : props.theme.text.subhead.fontSize)};
`;

export const RoteirizacaoTexto = styled.Text`
  color: ${(props) => props.theme.primary};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const DescricaoTexto = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const EnderecoContainer = styled.View`
  flex: 1;
`;

export const OpcoesContainer = styled.View`
  flex-direction: row;
  z-index: 999;
`;

export const DescricaoTextoTitulo = styled.Text`
  padding-right: 5px;
  color: ${(props) => props.theme.text.body1.color};
  font-weight: 700;
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const TextoRowContainer = styled.View`
  flex-direction: row;
`;

export const OSTexto = styled.Text<ITitulo>`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : props.theme.text.headline.fontSize)};
`;

export const Titulo = styled.Text<ITitulo>`
  color: ${(props) => props.color ?? props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : props.theme.text.headline.fontSize)};
`;

export const PeriodicidadeTexto = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: 10px;
`;
