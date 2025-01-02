import styled from 'styled-components/native';
import Constants from 'expo-constants';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IItemContainer {
  width?: number;
  heigth?: number;
  backgroundColor?: string;
}

interface IRow {
  flex?: number;
  noBorder?: boolean;
}

export const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: 5px;
  background-color: ${(props) => props.theme.background};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const CabecalhoContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 15px 0px;
  flex-direction: row;
  background-color: ${(props) => props.theme.secundary};
`;

export const Logo = styled.Image`
  flex: 1;
  height: 100%;
  width: 100%;
`;

export const UsuarioContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const UsuarioNome = styled.Text`
  margin-right: 10px;
  margin-left: 20px;
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const OfflineContainer = styled.View`
  height: 4px;
  background-color: ${(props) => props.theme.colors.orange};
`;

export const ItemContainer = styled.TouchableOpacity<IItemContainer>`
  align-items: center;
  justify-content: center;
  width: ${(props) => `${props.width ?? 100}%`};
  position: relative;
  height: ${(props) => `${props.heigth ?? 100}%`};;
  background-color: ${(props) => props.backgroundColor ?? props.theme.primary};
`;

export const RowContainer = styled.View<IRow>`
  flex: ${(props) => props.flex ?? 1};
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: ${(props) => `${props.noBorder ? 0 : 5}px`};
`;

export const ColumnContainer = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const MenuTitulo = styled.Text<{ color?: string }>`
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props?.color ?? props.theme.secundary};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const Titulo = styled.Text`
  color: ${(props) => props.theme.colors.orange};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: 22px;
`;

export const DescricaoContainer = styled.View`
  position: absolute;
  bottom: 0px;
  right: 0px;
  left: 0px;
  padding: 2px;
`;

export const Descricao = styled.Text<{ important?: boolean; color?: string; align?: 'left' | 'center' | 'right' }>`
  text-align: ${(props) => props.align ?? 'center'};
  font-weight: 900;
  padding-left: ${(props) => props.align === 'left' ? `${6}px` : 0};
  font-family: ${(props) => props.theme.text.subhead.fontFamily};
  font-size: ${(props) => props.theme.text.subhead.fontSize};
  color: ${(props) => props.important ? props.theme.colors.accent : props?.color ?? props.theme.colors.white};
`;
