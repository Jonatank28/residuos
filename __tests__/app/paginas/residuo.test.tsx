import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import TelaResiduo from '../../../src/app/paginas/residuo';
import { AuthNavigatorParamsList, AuthRoutes } from '../../../src/app/routes/routes';

const mockedDispatch = jest.fn();

jest.mock('@react-navigation/core');
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

describe('<TelaResiduo />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockedDispatch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', () => {
    const route = useRoute<RouteProp<AuthNavigatorParamsList, AuthRoutes.Residuo>>();

    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <TelaResiduo route={route} navigation={useNavigation()} />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
