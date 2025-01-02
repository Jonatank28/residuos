import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather'

export const Container = styled.View`
  flex: 1;
  padding: 80px 10px 20px 10px;
  background-color: ${(props) => props.theme.background};
`;

export const UsuarioContainer = styled.View`
  padding: 20px;
  border-radius: 5px;
  position: relative;
  background-color: ${(props) => props.theme.card.background};
`;

export const AvatarContainer = styled.TouchableOpacity`
  position: absolute;
  top: -50px;
  left: 40%;
`;

export const AvatarCamera = styled(FeatherIcon)`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;
