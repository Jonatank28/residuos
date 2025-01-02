import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'styled-components/native';
import * as Themes from '../../../src/app/styles/themes';
import DropDownOptions, { IDropDownItems } from '../../../src/app/componentes/dropdownOptions';

describe('<DropDownOptions />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches last snapshot', async () => {
    const items: IDropDownItems[] = [
      { label: '1', value: 'test 1' },
      { label: '2', value: 'test 2' },
    ];

    const tree: any = await renderer.create(
      <ThemeProvider theme={Themes.light}>
        <DropDownOptions
          items={items}
          value="test 1"
          onChange={() => {}}        />
      </ThemeProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(tree.children.length).toBe(2);
  });
});
