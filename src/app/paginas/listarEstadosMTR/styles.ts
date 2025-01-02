import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10
  },
})``;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EstadoContainer = styled.TouchableOpacity`
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const EstadoSinirContainer = styled.TouchableOpacity`
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.green};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;