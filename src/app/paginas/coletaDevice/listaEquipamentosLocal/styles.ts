import styled from 'styled-components/native';

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

export const EquipamentoContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: 5px;
  min-height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.card.background};
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EquipamentoRemovidoContainer = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 2px 5px;
  border-radius: 25px;
  background-color: ${(props) => props.theme.colors.accent};
`;

export const DeletadoTexto = styled.Text`
  color: ${(props) => props.theme.secundary};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const Titulo = styled.Text`
  text-transform: uppercase;
  padding-left: 10px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;
