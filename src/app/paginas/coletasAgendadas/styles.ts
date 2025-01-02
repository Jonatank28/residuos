import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IOpcaoMapaContainer {
  hasBorderBottom?: boolean;
}

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const Spacer = styled.View`
  height: 10px;
`;

export const PlacaContainer = styled.View`
  flex: 1;
  padding: 10px 20px;
  margin-right: 5px;
  align-items: center;
  border-radius: 5px;
  flex-direction: row;
  background-color: ${(props) => props.theme.card.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const ImobilizadosContainer = styled.TouchableOpacity`
  flex: 0.4;
  margin-right: 5px;
  border-radius: 5px;
  align-items: center;
  max-width: 60px;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.green};
`;

export const BotaoPesquisarContainer = styled.TouchableOpacity`
  margin-left: 5px;
  border-radius: 5px;
  align-items: center;
  width: 50px;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.white};
`;

export const MapaContainer = styled.TouchableOpacity`
  flex: 0.4;
  margin-right: 5px;
  border-radius: 5px;
  align-items: center;
  max-width: 60px;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.green};
`;

export const SincronizarContainer = styled.TouchableOpacity`
  flex: 0.4;
  max-width: 60px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.orange};
`;

export const RowContainer = styled.View`
  flex-direction: row;
  margin: 10px 10px 0px 10px;
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  padding-left: 5px;
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const OpcaoMapaContainer = styled.TouchableOpacity<IOpcaoMapaContainer>`
  width:90%;
  padding: 10px;
  flex-direction: row;
  border-bottom-color: ${(props) => props.theme.card.border};
  border-bottom-width: ${(props) => `${props.hasBorderBottom ? 1 : 0}px`};
`;

export const ContainerQuantidadeColetas = styled.View`
  width:100%;
  padding-right: 10px;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const IconeMapaContainer = styled.View`
  flex:0.2;
  justify-content: center;
`;
export const TextoMapaContainer = styled.View`
  flex:0.8;
  padding-left: 10px;
  align-items:flex-start;
  justify-content:center;
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 10px;
  padding: 8px 8px;
  margin: 0px 2px;
  height: 55px;
  flex-direction: row;
`;

export const CaixaDePesquisaContainer = styled.View`
  flex: 4;
  border-radius: 5px;
  justify-content: center;
  background-color: ${(props) => props.theme.card.background};
`;

export const CaixaDePesquisa = styled.TextInput`
  flex: 1;
  min-height: 40px;
  padding-right: 10px;
  padding-left: 12px;
  color: ${(props) => props.theme.text.headline.color};
`;
