import * as React from 'react';
import * as Themes from '../../../src/app/styles/themes';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components/native';
import TelaConfiguracaoInicial from '../../../src/app/paginas/configuracaoInicial';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorParamsList, CommonRoutes } from '../../../src/app/routes/routes';

const mockedDispatch = jest.fn();

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

describe('<TelaConfiguracaoInicial />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockedDispatch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', () => {
    const route = useRoute<RouteProp<AppNavigatorParamsList, CommonRoutes.ConfiguracaoInicial>>();

    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <TelaConfiguracaoInicial route={route} navigation={useNavigation()} />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
