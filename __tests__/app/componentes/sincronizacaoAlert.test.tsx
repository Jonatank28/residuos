import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import SincronizacaoAlert from '../../../src/app/componentes/sincronizacaoAlert';

describe('<SincronizacaoAlert />', () => {
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
        <SincronizacaoAlert onPressAgain={() => null} closeModal={() => null} onPressConfirm={() => null} progress={{
          message: '',
          progress: 0
        }} active={true} />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(1);
  });
});
