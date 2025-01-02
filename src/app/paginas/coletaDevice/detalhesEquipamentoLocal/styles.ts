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

export const InputContainer = styled.View`
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 20px;
  min-height: 50px;
  justify-content: center;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EquipamentoContainer = styled.View`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const TituloInput = styled.Text`
  margin-bottom: 5px;
  margin-left: 10px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: 14px;
`;
