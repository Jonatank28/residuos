import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const FundoModal = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: true,
  contentContainerStyle: {
    padding: 5,
  },
})``;

export const Container = styled.View`
  width: 80%;
  height: 30%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${(props) => props.theme.card.background};
`;

export const IconContainer = styled.View`
  padding-top: 20px;
  padding-bottom: 20px;
  align-items: center;
  justify-content: center;
`;

export const Modal = styled.Modal``;

export const TituloContainer = styled.View`
  flex: 0.5;
  padding-top: 5px;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const DescricaoContainer = styled.View`
  flex: 1;
  justify-content: center;
  width: 100%;
  padding-right: 20px;
  padding-left: 20px;
`;

export const Titulo = styled.Text`
  flex: 1;
  text-align: center;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Description = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;
