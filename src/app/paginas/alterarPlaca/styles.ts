import styled from 'styled-components/native';

interface IVeiculoContainer {
  isVehicle?: boolean;
  hasMarginBottom?: boolean;
}

interface ITituloContainer {
  flex?: number;
  alignItems?: 'flex-end' | 'flex-start';
}

export const Container = styled.KeyboardAvoidingView`
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

export const VeiculoContainer = styled.TouchableOpacity<IVeiculoContainer>`
  padding: 10px;
  border-radius: 5px;
  min-height: 50px;
  margin-left: 10px;
  margin-right: 10px;
  flex-direction: row;
  margin-bottom: ${(props) => `${props.hasMarginBottom ? 10 : 0}px`};
  background-color: ${(props) => (props.isVehicle ? props.theme.colors.green : props.theme.card.background)};
`;

export const TituloContainer = styled.View<ITituloContainer>`
  flex: ${(props) => props.flex ?? 1};
  align-items: ${(props) => props.alignItems ?? 'flex-start'};
  justify-content: center;
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  text-transform: uppercase;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 10px;
  padding: 8px 8px; 
  height: 55px;
  flex-direction: row;
`;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
`;