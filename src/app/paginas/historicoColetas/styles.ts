import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const PesquisarContainer = styled.View`
  margin: 20px 20px 40px 20px;
`;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
`;
