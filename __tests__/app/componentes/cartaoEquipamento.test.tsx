import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import CartaoEquipamento from '../../../src/app/componentes/cartaoEquipamento';

describe('<CartaoEquipamento />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', () => {
    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoEquipamento />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(3);
  });
});
