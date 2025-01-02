import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface Container {
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  backgroundColor?: string;
}

interface IEditarInput {
  color?: string;
}

interface ITexto {
  hasBackgroundColor?: boolean;
}

export const Container = styled.View<Container>`
  flex-direction: row;
  position: relative;
  margin-top: ${(props) => `${props?.marginTop ?? 0}px`};
  margin-bottom: ${(props) => `${props?.marginBottom ?? 0}px`};
  margin-right: ${(props) => `${props?.marginRight ?? 0}px`};
  margin-left: ${(props) => `${props?.marginLeft ?? 0}px`};
  background-color: ${(props) => props?.backgroundColor ?? props.theme.card.background};
`;

export const ColumnContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  padding-top: 5px;
  padding-bottom: 5px;
`;

export const UnidadeEditarContainer = styled.View`
  padding-right: 2px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.card.background};
`;

export const EditarQuantidadeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const AdicionarQuantidadeContainer = styled.TouchableOpacity`
  align-items: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  justify-content: center;
  max-height: 60px;
  width: 30px;
  background-color: ${(props) => props.theme.primary};
`;

export const DiminuirQuantidadeContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  max-height: 60px;
  width: 30px;
  background-color: ${(props) => props.theme.colors.accent};
`;

export const InputContainer = styled.View`
  flex-direction: row;
`;

export const EditarInput = styled.TextInput<IEditarInput>`
  padding: 5px;
  color: ${(props) => props.color ?? props.theme.text.input.color};
  max-height: 60px;
  background-color: ${(props) => props.theme.card.background};
`;

export const DeletarContainer = styled.TouchableOpacity`
  flex: 0.3;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.accent};
`;

export const HasDuplicadoContainer = styled.View`
  position: absolute;
  top: -5px;
  right: -10px;
  padding: 2px 5px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.primary};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const TituloContainer = styled.View`
  flex: 1;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 5px;
`;

export const DescricaoContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

export const Titulo = styled.Text<ITexto>`
  color: ${(props) => (props.hasBackgroundColor
    ? props.theme.secundary
    : props.theme.text.headline.color)};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const DuplicadoTexto = styled.Text`
  color: ${(props) => props.theme.card.background};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const PesoBrutoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Descricao = styled.Text<ITexto>`
  color: ${(props) => (props.hasBackgroundColor
    ? props.theme.secundary
    : props.theme.text.subhead.color)};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;
