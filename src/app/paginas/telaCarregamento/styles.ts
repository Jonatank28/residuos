import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.splashScreen.background};
`;

export const Description = styled.Text`
  color: ${(props) => props.theme.colors.white};
`;
