import { ITheme } from "./src/presentation";

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends ITheme {}
}

export interface IThemeStyledComponentProps {
  theme: import("styled-components").DefaultTheme;
}
