import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

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
  width: 100%;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ResiduoContainer = styled.View`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const FotoRowContainer = styled.View`
  gap: 10px;
  flex-wrap: wrap;
  flex-direction: row;
`;

export const ResiduoColetadoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 10px;
  width: 100%;
  justify-content: space-around;
`;

export const Spacer = styled.View`
  width: 5px;
`;

export const ResiduoColetadoItem = styled.View`
  padding: 8px;
  border-width: 1px;
  margin-bottom: 5px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  border-color: ${props => props.theme.card.border}
`;

export const ModalFoto = styled.Modal``;

export const FotoModalContainer = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

export const ModalContainer = styled.View`
  position: relative;
  margin: 80px 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const FecharModalContainer = styled.TouchableOpacity`
  padding: 5px;
  border-width: 1px;
  margin: 10px;
  border-color: ${(props) => props.theme.card.border};
  border-radius: 5px;
  position: absolute;
  top: 0px;
  right: 0px;
`;

export const FeatherIcone = styled(FeatherIcon)`
  color: ${(props) => props.theme.card.border};
`;

export const FotoContainer = styled.TouchableOpacity`
  width: 40px;
  margin-right: 10px;
  height: 40px;
  margin-bottom: 5px;
`;

export const Foto = styled.Image`
  flex: 1;
  height: 100%;
  border-radius: 5px;
  width: 100%;
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
