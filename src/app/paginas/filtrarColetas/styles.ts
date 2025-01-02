import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

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

export const ItemsContainer = styled.View`
  width: 100%;
`;

export const DatePicker = styled(DateTimePicker)``;

export const DatePickerContainer = styled.View`
  height: ${(_) => `${Platform.OS === 'ios' ? 30 : 0}%`};
  width: 100%;
  background-color: ${(props) => props.theme.background};
`;

export const HideDatapicker = styled.TouchableOpacity`
  align-items: flex-end;
  justify-content: center;
  border-width: 1px;
  border-top-color: ${(props) => props.theme.card.border};
  border-bottom-color: ${(props) => props.theme.card.border};
  padding-right: 20px;
  min-height: 40px;
  background-color: ${(props) => props.theme.background};
`;

export const DataContainer = styled.TouchableOpacity`
  flex: 1;
  padding-left: 20px;
  justify-content: center;
  min-height: 50px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.border.color};
  background-color: ${(props) => props.theme.card.background};
`;

export const RowContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

export const Spacer = styled.View`
  width: 10px;
  height: 10px;
`;

export const BotaoContainer = styled.View`
  z-index: -1;
  flex-direction: row;
  margin: 30px 20px;
`;

export const TextoDatapicker = styled.Text`
  color: ${(props) => props.theme.text.headline.color};
  font-weight: ${(props) => props.theme.text.headline.fontWeight};
  font-family: ${(props) => props.theme.text.headline.fontFamily};
  font-size: ${(props) => props.theme.text.headline.fontSize};
`;

export const TextoData = styled.Text`
  color: ${(props) => props.theme.text.body1.color};
  font-weight: ${(props) => props.theme.text.body1.fontWeight};
  font-family: ${(props) => props.theme.text.body1.fontFamily};
  font-size: ${(props) => props.theme.text.body1.fontSize};
`;
