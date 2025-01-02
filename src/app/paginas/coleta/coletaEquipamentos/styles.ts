import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const TotalEquipamentosContainer = styled.View`
  align-items: center;
  padding-right: 10px;
`;

export const TotalEquipamentosTexto = styled.Text`
  color: ${props => props.theme.text.body1.color};
  font-weight: ${props => props.theme.text.body1.fontWeight};
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
`;

export const BotaoContainer = styled.View`
  flex-direction: row;
  margin: 10px 10px 30px 10px;
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
