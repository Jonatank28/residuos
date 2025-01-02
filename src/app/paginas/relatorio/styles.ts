import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.white};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingTop: 20,
    paddingBottom: 20
  }
})``;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const MensagemSincronizacao = styled.Text`   
  padding: 5px;
  text-align: right ;
  color: ${(props) => props.theme.text.body1.color};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Mensagem = styled.Text`
  text-align: center ;
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const DescricaoContainer = styled.View`
  align-items: center;
`;

