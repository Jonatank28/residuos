import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import CartaoEquipamentoLocal from '../../../src/app/componentes/cartaoEquipamentoLocal';
import { IEquipamento } from '../../../src/core/domain/entities/equipamento';

describe('<CartaoEquipamentoLocal />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', () => {
    const equipamento: IEquipamento = {};

    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoEquipamentoLocal
          equipamento={equipamento}
        />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(2);
  });
});
