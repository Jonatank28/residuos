import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

export const Spacer = styled.View`
  height: 10px;
`;

export const CartaoRegioesContainer = styled.View`
  background-color: ${props => props.theme.card.background};
  border-radius: 6px;
  padding: 20px;
  align-items: center;
`;

export const CartaoRegioesTituloContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: #33cc66;
  color: #33cc66;
  border-radius: 90px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const FeatherIcone = styled(FeatherIcon)`
  color: ${props => props.theme.secundary};
`;

export const RegiaoContainer = styled.View`
  flex-direction: row;
  min-height: 50px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-color: ${props => props.theme.border.color};
  border-width: 1px;
  background-color: ${props => props.theme.card.background};
`;

export const TituloContainer = styled.View`
  flex: 1;
  padding: 10px 20px;
  justify-content: center;
`;

export const DeletarRegiaoContainer = styled.TouchableOpacity`
  flex: 0.3;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: ${props => props.theme.colors.accent};
`;

export const BotaoContainer = styled.View`
  margin-top: 30px;
`;

export const DescricaoContainer = styled.View`
  width: 100%;
  padding: 10px;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  color: ${props => props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: ${props => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${props => props.theme.text.body2.color};
  font-weight: ${props => props.theme.text.body2.fontWeight};
  font-family: ${props => props.theme.text.body2.fontFamily};
  font-size: ${props => props.theme.text.body2.fontSize};
`;
