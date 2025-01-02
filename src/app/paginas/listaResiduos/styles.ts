import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px 10px 0px 10px;
  background-color: ${(props) => props.theme.background};
`;

export const DescricaoContainer = styled.TouchableOpacity<{ preecherTudo?: boolean }>`
  padding: 5px 5px 5px 13px;
  flex: ${props => props.preecherTudo ? 1 : 0.7};
`;

export const PesoBrutoContainer = styled.View`
  padding-bottom: 10px;
  justify-content: space-between;
  flex-direction: row;
`;

export const ResiduoContainer = styled.View<{ backgroundColor?: string; corTexto?: string }>`
  position: relative;
  flex-direction: row;
  min-height: 45px;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  color: ${props => props.corTexto ?? props.theme.text.headline.color};
  background-color: ${props => props.backgroundColor ?? props.theme.card.background};
`;

export const EditarQuantidadeContainer = styled.View`
  flex-direction: row;
  flex: 0.3;
  border-bottom-right-radius: 5px;
`;

export const AdicionarQuantidadeContainer = styled.TouchableOpacity`
  align-items: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  justify-content: center;
  max-height: 60px;
  width: 25px;
  background-color: ${(props) => props.theme.primary};
`;

export const InputContainer = styled.View`
  flex-direction: row;
`;

export const UnidadeEditarContainer = styled.View`
  padding-right: 2px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.card.background};
`;

export const Descricao = styled.Text<{ hasBackgroundColor?: boolean; }>`
  color: ${(props) => (props.hasBackgroundColor
    ? props.theme.secundary
    : props.theme.text.subhead.color)};
  font-weight: ${(props) => props.theme.text.subhead.fontWeight};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
`;

export const EditarInput = styled.TextInput<{ color?: string; }>`
  padding: 5px;
  color: ${(props) => props.color ?? props.theme.text.input.color};
  max-height: 60px;
  background-color: ${(props) => props.theme.card.background};
`;

export const DiminuirQuantidadeContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  max-height: 60px;
  width: 25px;
  background-color: ${(props) => props.theme.colors.accent};
`;

export const ResiudoAdicionadoPesagem = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 8px;
  background-color: ${(props) => props.theme.primary};
`;

export const AddedContainer = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  padding: 2px 5px;
  background-color: ${(props) => props.theme.primary};
`;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 40px;
`;

export const DuplicadoTexto = styled.Text`
  color: ${(props) => props.theme.card.background};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
