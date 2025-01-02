import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  vertical: true,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: 0,
  },
})``;

export const DatePickerContainer = styled.View`
  height: ${_ => `${Platform.OS === 'ios' ? 30 : 0}%`};
  width: 100%;
  background-color: ${props => props.theme.background};
`;

export const HideDatapicker = styled.TouchableOpacity`
  align-items: flex-end;
  justify-content: center;
  border-top-width: 1px;
  border-bottom-width: 1px;
  padding-right: 20px;
  min-height: 40px;
  border-top-color: ${props => props.theme.card.border};
  border-bottom-color: ${props => props.theme.card.border};
  background-color: ${props => props.theme.background};
`;

export const DatePicker = styled(DateTimePicker)``;

export const DataHoraContainer = styled.View`
  flex-direction: row;
`;

export const DataContainer = styled.TouchableOpacity`
  flex: 1;
  margin-right: 10px;
  border-radius: 5px;
  border-color: ${props => props.theme.icon.color};
`;

export const FeatherIcone = styled(FeatherIcon)``;

export const DataIconContainer = styled.View`
  align-items: center;
  padding-left: 10px;
  flex-direction: row;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${props => props.theme.border.color};
  background-color: ${props => props.theme.card.background};
`;

export const HoraContainer = styled.TouchableOpacity`
  flex: 0.6;
  border-radius: 5px;
  border-color: ${props => props.theme.icon.color};
`;

export const Input = styled.TextInput`
  border-radius: 5px;
  padding: 5px 10px;
  width: 100%;
  min-height: 50px;
  color: ${props => props.theme.text.input.color};
  border-width: 1px;
  border-color: ${props => props.theme.border.color};
  background-color: ${props => props.theme.text.input.background};
`;

export const BotaoContainer = styled.View`
  margin-top: 5px;
  padding: 0 20px;
`;

export const TextoDataContainer = styled.View`
  min-height: 50px;
  align-items: center;
  padding-left: 10px;
  justify-content: center;
`;

export const TextoData = styled.Text`
  color: ${props => props.theme.text.body1.color};
  font-weight: ${props => props.theme.text.body1.fontWeight};
  font-family: ${props => props.theme.text.body1.fontFamily};
  font-size: ${props => props.theme.text.body1.fontSize};
`;

export const TextoDatapicker = styled.Text`
  color: ${props => props.theme.text.headline.color};
  font-weight: ${props => props.theme.text.headline.fontWeight};
  font-family: ${props => props.theme.text.headline.fontFamily};
  font-size: ${props => props.theme.text.headline.fontSize};
`;
export const MTRContainer = styled.View`
  flex-direction: row;
`;

export const AwesomeIcone = styled(AwesomeIcon)``;

export const IconContainer = styled.TouchableOpacity`
  flex: 0.2;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${props => props.theme.primary};
  margin-left: 5px;
`;

export const InputContainer = styled.View`
  flex: 1;
`;

export const NaoColetadoContainer = styled.View`
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: ${props => props.theme.card.background};
`;
