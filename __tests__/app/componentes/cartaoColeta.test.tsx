import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import CartaoColeta from '../../../src/app/componentes/cartaoColeta';

describe('<CartaoColeta />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot details', () => {
    const tree = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoColeta isDetails />
      </ThemeProvider>,
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('matches last snapshot not details', () => {
    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoColeta isDetails={false} />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(2);
  });
});
