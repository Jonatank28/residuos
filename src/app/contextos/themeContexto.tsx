import * as React from 'react';
import * as Themes from '../styles/themes';
import { usePersistedState } from 'vision-common';
import { $THEME_KEY } from '../../core/constants';
import { StatusBar } from 'react-native';
import { ThemeProvider as StyledComponentsTheme } from 'styled-components';

interface ThemeContextData {
  toggleTheme(): void;
  mode: 'light' | 'dark';
}

type Props = { children?: React.ReactNode }

export const ThemeContext = React.createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC = ({ children }: Props) => {
  const [theme, setTheme] = usePersistedState<'light' | 'dark'>($THEME_KEY, 'light');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  React.useEffect(() => StatusBar.setBarStyle(theme === 'light' ? 'light-content' : 'dark-content', false), [theme]);

  return (
    <StyledComponentsTheme theme={theme === 'light' ? Themes.light : Themes.dark}>
      <ThemeContext.Provider value={{ toggleTheme, mode: theme }}>
        {children}
      </ThemeContext.Provider>
    </StyledComponentsTheme>
  );
}

export const useThemeContext = () => React.useContext(ThemeContext);

