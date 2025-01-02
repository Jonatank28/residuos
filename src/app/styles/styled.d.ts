import 'styled-components';
import { ThemeInterface } from 'vision-common';
import { VSQuestionarioTheme } from 'vision-questionario';

declare module 'styled-components' {
  interface DefaultTheme extends ThemeInterface, VSQuestionarioTheme {
    splashScreen: {
      background: string;
    }
  }
}
