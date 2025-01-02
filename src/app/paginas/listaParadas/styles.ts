import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 5px;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10,
  },
})``;

export const MotivoContainer = styled.TouchableOpacity`
  margin-bottom: 10px;
  border-radius: 5px;
  min-height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.card.background};
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Titulo = styled.Text`
  text-transform: uppercase;
  padding: 10px;
  color: ${props => props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: ${props => props.theme.text.headline.fontSize};
`;

export const IconContainer = styled.View`
  flex: 0.1;
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const IconeContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: #33cc66;
  color: #33cc66;
  border-radius: 90px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const FlatListContainer = styled.FlatList.attrs<{ data: any[] }>({
  contentContainerStyle: {
    padding: 10,
  },
})`
  background-color: #f5f5f5;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${props => props.theme.border.color};
  flex: 1;
`;

// Estilo dos componentes
export const CartaoParadaContainer = styled.View`
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: ${props => props.theme.card.background};
  border: 1px solid ${props => props.theme.border.color};
`;

export const Descricao = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: ${props => props.theme.text.headline.color};
`;

export const Info = styled.Text`
  font-size: 14px;
  margin-bottom: 3px;
  color: ${props => props.theme.text.body1.color};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 10px;
  align-self: flex-end;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  border-radius: 5px;
  margin-right: 10px;
`;

export const EditButton = styled(Button)`
  background-color: #33cc66;
`;

export const DeleteButton = styled(Button)`
  background-color: #cc3333;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  margin-left: 5px;
`;
