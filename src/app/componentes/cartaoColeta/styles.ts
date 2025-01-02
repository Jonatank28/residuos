import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IContainer {
  isDetails?: boolean;
}

interface IImage {
  width?: number;
  height?: number;
}

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
  hasBorder?: boolean;
}

interface ITitulo {
  color?: string;
  fontSize?: number;
}

export const Container = styled.TouchableOpacity<IContainer>`
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: ${props => `${props.isDetails ? 5 : 0}px`};
  background-color: ${props => props.theme.card.background};
`;

export const FeatherIcone = styled(FeatherIcon)`
  color: ${props => props.theme.secundary};
`;

export const StatusTextoContainer = styled.View`
  align-items: flex-end;
  padding-bottom: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10;
`;

export const OpcaoContainer = styled.TouchableOpacity<IOpcaoContainer>`
  padding: 5px;
  margin: 0px 2px;
  border-radius: 5px;
  max-height: 25px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor ?? props.theme.colors.orange};
`;

export const StatusContainer = styled.View<IOpcaoContainer>`
  width: 10px;
  border-top-left-radius: ${props => `${props.hasBorder ? 5 : 0}px`};
  border-bottom-left-radius: ${props => `${props.hasBorder ? 5 : 0}px`};
  background-color: ${props => props.backgroundColor ?? props.theme.colors.green};
`;

export const ConteudoContainer = styled.View`
  flex: 1;
`;

export const Image = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.View<IImage>`
  width: ${props => `${props.width ?? 50}px`};
  height: ${props => `${props.height ?? 50}px`};
  margin-right: 5px;
`;

export const TituloContainer = styled.View`
  flex: 1;
`;

export const DescricaoPendenteContainer = styled.View`
  justify-content: center;
`;

export const DataContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;

export const RowContainer = styled.View<IRowContainer>`
  flex: ${props => props.flex ?? 1};
  justify-content: ${props => props.justifyContent ?? 'flex-start'};
  padding-right: ${props => `${props.marginRight ?? 10}px`};
  padding-left: ${props => `${props.marginLeft ?? 10}px`};
  padding-top: ${props => `${props.marginTop ?? 10}px`};
  padding-bottom: ${props => `${props.marginBottom ?? 10}px`};
  flex-direction: row;
  align-items: ${props => (props.isBottom ? 'center' : 'flex-start')};
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
  color: ${props => props.theme.text.subhead.color};
  font-weight: ${props => props.theme.text.subhead.fontWeight};
  font-family: ${props => props.theme.text.subhead.fontFamily};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : props.theme.text.subhead.fontSize)};
`;

export const DescricaoPendente = styled.Text<ITitulo>`
  text-transform: uppercase;
  color: ${props => props.color ?? props.theme.colors.accent};
  font-weight: ${props => props.theme.text.caption.fontWeight};
  font-family: ${props => props.theme.text.caption.fontFamily};
  font-size: ${props => props.theme.text.caption.fontSize};
`;

export const RoteirizacaoTexto = styled.Text`
  color: ${props => props.theme.primary};
  font-weight: ${props => props.theme.text.body1.fontWeight};
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
`;

export const DescricaoTexto = styled.Text`
  color: ${props => props.theme.text.body1.color};
  font-weight: ${props => props.theme.text.body1.fontWeight};
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
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
  color: ${props => props.theme.text.body1.color};
  font-weight: 700;
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
`;

export const TextoRowContainer = styled.View`
  flex-direction: row;
`;

export const OSTexto = styled.Text<ITitulo>`
  color: ${props => props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : props.theme.text.headline.fontSize)};
`;

export const Titulo = styled.Text<ITitulo>`
  color: ${props => props.color ?? props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : props.theme.text.headline.fontSize)};
`;
