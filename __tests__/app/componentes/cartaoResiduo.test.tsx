import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import CartaoResiduo from '../../../src/app/componentes/cartaoResiduo';
import { IResiduo } from '../../../src/core/domain/entities/residuo';

describe('<CartaoResiduo />', () => {
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
        <CartaoResiduo
          residuo={residuo}
          hasQuantidadeContainer={false}
          onPressAdicionarQuantidade={() => {}}
          onPressDiminuirQuantidade={() => {}}
          podeExcluirResiduo
        />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(1);
  });

  it('matches last snapshot not exclude wast', () => {
    const residuo: IResiduo = {
      codigoHashResiduo: ''
    };

    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoResiduo
          residuo={residuo}
          hasQuantidadeContainer={false}
          onPressAdicionarQuantidade={() => {}}
          onPressDiminuirQuantidade={() => {}}
          podeExcluirResiduo={false}
        />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(1);
  });

  it('matches last snapshot not exclude wast but has edit', () => {
    const residuo: IResiduo = { codigoHashResiduo: '' };

    const tree: any = renderer.create(
      <ThemeProvider theme={Themes.light}>
        <CartaoResiduo
          residuo={residuo}
          hasQuantidadeContainer
          onPressAdicionarQuantidade={() => {}}
          onPressDiminuirQuantidade={() => {}}
          podeExcluirResiduo={false}
        />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(2);
  });
});
