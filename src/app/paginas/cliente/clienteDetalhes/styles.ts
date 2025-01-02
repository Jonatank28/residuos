import styled from 'styled-components/native';

interface IDescricaoContainer {
  flex?: number;
}

interface IDescricao {
  hasCenter?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 10
  },
})``;

export const SemConteudoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const HasCheckInContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const VerClienteContainer = styled.TouchableOpacity`
  border-radius: 5px;
  padding: 10px;
`;

export const RowContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const DescricaoContainer = styled.View<IDescricaoContainer>`
  flex: ${(props) => props.flex ?? 1};
  min-height: 50px;
  width: 100%;
  justify-content: center;
  margin-top: 5px;
  padding: 10px 20px;
  border-color: ${(props) => props.theme.border.color};
  border-width: 1px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.card.background};
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const BotaoContainer = styled.View`
  margin-top: 20px;
`;

export const NomeCliente = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

export const Descricao = styled.Text<IDescricao>`
  text-align: ${(props) => (props.hasCenter ? 'center' : 'left')};
  color: ${(props) => props.theme.text.body2.color};
  font-weight: ${(props) => props.theme.text.body2.fontWeight};
  font-family: ${(props) => props.theme.text.body2.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
