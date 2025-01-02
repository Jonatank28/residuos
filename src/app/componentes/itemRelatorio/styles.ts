import styled from "styled-components/native";

interface IRowContainer {
  hasColor?: boolean;
  hasBorder?: boolean;
}

interface IContainer {
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number
  backgroundColor?: string;
}

interface IRowDescricaoContainer {
  flex?: number;
  paddingLeft?: number;
  paddingRight?: number;
  alignItems?:  'flex-start' | 'center' | 'flex-end';
}

export const Container = styled.TouchableOpacity<IContainer>`
  margin-top: ${(props) => `${props?.marginTop ?? 0}px`};
  margin-bottom: ${(props) => `${props?.marginBottom ?? 0}px`};
  margin-left: ${(props) => `${props?.marginLeft ?? 0}px`};
  margin-right: ${(props) => `${props?.marginRight ?? 0}px`};
  background-color: ${(props) => props?.backgroundColor ?? props.theme.colors.white};
`;

export const TituloContainer = styled.View`
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  justify-content: center;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 20px;
`;

export const DescricaoContainer = styled.View`
  flex-direction: column;
`;

export const ColumnTituloContainer = styled.View<IRowDescricaoContainer>`
  flex: ${(props) => props?.flex ?? 1};
  align-items: center;
  justify-content: center;
  padding-left: ${(props) => `${props.paddingLeft ?? 0}px`};
  padding-right: ${(props) => `${props.paddingRight ?? 0}px`};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  padding: 5px 10px;
  align-items: center;
  justify-content: center;
`;

export const RowDescricaoContainer = styled.View<IRowDescricaoContainer>`
  flex: ${(props) => props?.flex ?? 1};
  padding-left: ${(props) => `${props?.paddingLeft ?? 0}px`};
  padding-right: ${(props) => `${props?.paddingRight ?? 0}px`};
  align-items: ${(props) => props?.alignItems ?? 'center'};
`;

export const ColumnContainer = styled.View`
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 10px;
`;

export const RowsContainer = styled.View`
  flex-direction: column;
`;

export const RowContainer = styled.View<IRowContainer>`
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom-width: ${(props) => `${props?.hasBorder && !props?.hasColor ? 1 : 0}px`};
  border-bottom-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.hasColor ? props.theme.border.color : props.theme.colors.white};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Descricao = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;

