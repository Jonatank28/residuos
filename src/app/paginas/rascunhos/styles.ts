import styled from 'styled-components/native';

interface IRascunhoStatusContainer {
  status?: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const PesquisarContainer = styled.View`
  margin: 20px 20px 40px 20px;
`;

export const RascunhoContainer = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  background-color: ${(props) => props.theme.card.background};
`;

export const RascunhoStatusContainer = styled.View<IRascunhoStatusContainer>`
  flex: 0.01;
  padding: 5px;
  background-color: ${(props) => (props.status
    ? (props.status === 1 || props.status === 2
      ? props.theme.colors.green
      : props.theme.colors.orange
    ) : props.theme.colors.orange)};
`;

export const DataContainer = styled.View`
  flex: 0.5;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: flex-end;
`;

export const CounteudoContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
