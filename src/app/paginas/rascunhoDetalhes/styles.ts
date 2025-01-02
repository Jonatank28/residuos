import styled from 'styled-components/native';

interface IDescricaoResiduo {
  hasTitle?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const DetalhesContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  flex-direction: row;
  min-height: 40px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const EquipamentoRemovidoContainer = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 2px 5px;
  border-radius: 25px;
  background-color: ${(props) => props.theme.colors.accent};
`;

export const ResiduoContainer = styled.View`
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  border-width: 1px;
  border-color: ${(props) => props.theme.card.border};
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ReisiduoDescricaoContainer = styled.View`
  flex: 1;
`;

export const ResiduoTituloContainer = styled.View`
  flex: 1;
  min-height: 40px;
  padding: 10px;
  margin-bottom: 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${(props) => props.theme.card.border};
`;

export const ResiduosBodyContainer = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 5px 10px;
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const DeletadoTexto = styled.Text`
  color: ${(props) => props.theme.secundary};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const DescricaoResiduo = styled.Text<IDescricaoResiduo>`
  margin-right: ${(props) => `${props.hasTitle ? 5 : 0}px`};
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => (props.hasTitle ? 700 : props.theme.text.body1.fontWeight)};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
