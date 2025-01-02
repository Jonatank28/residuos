import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import BloqueioAlert from '../../../src/app/componentes/bloqueioAlert';

describe('<BloqueioAlert />', () => {
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
        <BloqueioAlert />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(1);
  });
});
