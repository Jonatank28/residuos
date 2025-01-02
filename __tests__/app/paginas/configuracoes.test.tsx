import * as React from 'react';
import * as Themes from '../../../src/app/styles/themes';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components/native';
import TelaConfiguracoes from '../../../src/app/paginas/configuracoes';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthNavigatorParamsList, AuthRoutes } from '../../../src/app/routes/routes';

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

describe('<TelaConfiguracoes />', () => {
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
    const route = useRoute<RouteProp<AuthNavigatorParamsList, AuthRoutes.Configuracoes>>();

    const tree = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <TelaConfiguracoes route={route} navigation={useNavigation()} />
      </ThemeProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});