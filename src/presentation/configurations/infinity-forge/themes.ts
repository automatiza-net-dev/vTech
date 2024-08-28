import { DefaultThemeInfinityForge } from "infinity-forge/dist/system/presentation/context/theme";

const generalTheme = {
  black: "#000",
  red: "#ef1717",
  green: "#39b15d",
  orange: "#f18805",
  yellow: "#e1b400",
  secondaryColor: "red",
  darkColor: "#2B2B2B",
};

const liftone: DefaultThemeInfinityForge = {
  ...generalTheme,
  primaryColor: "#005862",
  cardsColor: "#b9e2fd",
};

const sancla: DefaultThemeInfinityForge = {
  ...generalTheme,
  primaryColor: "#ec8f24", //#FA972B
  cardsColor: "#FFCD56",
};

const vetech: DefaultThemeInfinityForge = {
  ...generalTheme,
  primaryColor: "#13C2C2",
};

const themes: {
  [key in "liftone" | "sancla" | "vetech"]: DefaultThemeInfinityForge;
} = {
  liftone,
  sancla,
  vetech,
};

export { themes };
