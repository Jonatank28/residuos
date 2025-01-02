import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import CartaoResiduoLocal from '../../../src/app/componentes/cartaoResiduoLocal';
import { IResiduo } from '../../../src/core/domain/entities/residuo';

describe('<CartaoResiduoLocal />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', () => {
    const residuo: IResiduo = {
      codigoHashResiduo: ''
    };

    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoResiduoLocal
          residuo={residuo}
        />
      </ThemeProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(2);
  });
});
