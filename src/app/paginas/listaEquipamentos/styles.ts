import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px 10px 0px 10px;
  background-color: ${(props) => props.theme.background};
`;

export const EquipamentoContainer = styled.View``;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
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

export const PesquisarContainer = styled.View`
  margin-bottom: 40px;
`;

export const DuplicadoTexto = styled.Text`
  color: ${(props) => props.theme.card.background};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const ItemContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 25px;
  background-color: ${props => props.theme.background};
`;
export const ContainerQuantidadeEquipoamentos = styled.View`
  width: 100%;
  padding-right: 10px;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

export const Descricao = styled.Text`
  padding-left: 5px;
  color: ${props => props.theme.text.body1.color};
  font-weight: ${props => props.theme.text.body1.fontWeight};
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
`;
