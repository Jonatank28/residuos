import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import { AuthNavigatorParamsList, AuthRoutes } from '../../../src/app/routes/routes';
import TelaListaClientes from '../../../src/app/paginas/cliente/listaClientes';

const mockedDispatch = jest.fn();
const mockedQuestionario = jest.fn();

jest.mock('@react-navigation/core');
jest.mock('vision-questionario', () => mockedQuestionario);
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useRoute: () => ({
      name: jest.fn(),
      params: jest.fn(),
    }),
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
  };
});

describe('<TelaClientes />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockedDispatch.mockClear();
    mockedQuestionario.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', () => {
    const route = useRoute<RouteProp<AuthNavigatorParamsList, AuthRoutes.Clientes>>();

    const tree = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <TelaListaClientes route={route} navigation={useNavigation()} />
      </ThemeProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
