
const generalTheme = {
  black: "#000",
  red: "#ef1717",
  green: "#39b15d",
  orange: "#f18805",
  yellow: "#e1b400",
  secondaryColor: "red",
  darkColor: "#2B2B2B",
};

const liftone = {
  ...generalTheme,
  primaryColor: "#005862",
  cardsColor: "#b9e2fd",
};

const sancla = {
  ...generalTheme,
  primaryColor: "#ec8f24", //#FA972B
  cardsColor: "#FFCD56",
};

const vetech = {
  ...generalTheme,
  primaryColor: "#13C2C2",
};

const clinicas = {
  ...generalTheme,
  primaryColor: "#7F7F7F",
}

const themes: {
  [key in "liftone" | "sancla" | "vetech" | "clinicas"];
} = {
  liftone,
  sancla,
  vetech,
  clinicas
};

export { themes };
