import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import Cabecalho from '../../../src/app/componentes/cabecalho';

const mockedDispatch = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
  };
});

describe('<Cabecalho />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockedDispatch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot right icon', () => {
    const tree = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <Cabecalho temIconeDireita />
      </ThemeProvider>,
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('matches last snapshot not right icon', () => {
    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <Cabecalho temIconeDireita={false} />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(2);
  });
});
