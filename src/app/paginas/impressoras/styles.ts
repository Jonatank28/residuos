import styled from 'styled-components/native';

interface IImpressoraContainer {
  hasConnected?: boolean;
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

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ImpressoraContainer = styled.TouchableOpacity<IImpressoraContainer>`
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.hasConnected
    ? props.theme.colors.green
    : props.theme.card.background
  };
`;

export const ImpressoraTituloContainer = styled.View`
  flex: 0.8;
  padding: 10px 20px;
  align-items: flex-start;
  justify-content: center;
`;

export const ImpressoraLoadingContainer = styled.View`
  flex: 0.2;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;