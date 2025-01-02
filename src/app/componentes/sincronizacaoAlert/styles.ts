import styled from 'styled-components/native';
import { ProgressBar } from 'react-native-paper';

export const FundoModal = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const BarraProgresso = styled(ProgressBar)``;

export const BarraProgressoTextoContainer = styled.View``;

export const Container = styled.View`
  height: 150px;
  width: 80%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${(props) => props.theme.card.background};
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

export const BotoesContainer = styled.View`
  flex: 0.5;
  width: 100%;
  min-height: 15px;
  flex-direction: row;
  border-top-width: 1px;
  justify-content: space-evenly;
`;

export const BotaoConfirmar = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const BotaoCacelar = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
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

export const TextoBotoes = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.button.fontWeight};
  font-family: ${(props) => props.theme.text.button.fontFamily};
  font-size: ${(props) => props.theme.text.button.fontSize};
`;

export const TextoBarraProgresso = styled.Text`
  color: ${(props) => props.theme.text.caption.color};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
  font-size: ${(props) => props.theme.text.caption.fontSize};
`;

export const TextoErro = styled.Text`
  font-size: 13px;
  text-align: center;
  color: ${(props) => props.theme.text.caption.color};
  font-weight: ${(props) => props.theme.text.caption.fontWeight};
  font-family: ${(props) => props.theme.text.caption.fontFamily};
`;
