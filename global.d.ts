import { ITheme } from "./src/presentation";

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends ITheme {
    black: string;
    darkColor: string;
    primaryColor: string;
    secondaryBg: string;
    highlight: string;
    red: string;
    green: string;
  }
}

export interface IThemeStyledComponentProps {
  theme: import("styled-components").DefaultTheme;
}
