import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px 10px 0px 10px;
  background-color: ${(props) => props.theme.background};
`;

export const LoadingContainer = styled.View`
  padding: 10px 0px 10px 0px;
`;

export const PesquisarContainer = styled.View`
  margin-bottom: 40px;
`;
