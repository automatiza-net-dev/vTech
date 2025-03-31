import { createContext, useContext } from "react";

export type ConfigurationSystem = {
  colors: string;
  home_image_url: string;
  id: number;
  logo_url: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  type: string;
  url: string;
};

const ConfigurationsContext = createContext<ConfigurationSystem>({
  colors: "",
  home_image_url: "",
  id: 0,
  logo_url: "",
  name: "",
  primary_color: "#000",
  secondary_color: "#000",
  type: "",
  url: ""
});

export function ConfigurationsSystemProvider({
  children,
  configurations,
}: {
  children: React.ReactNode;
  configurations: ConfigurationSystem
}) {
  return (
    <ConfigurationsContext.Provider value={configurations}>
      {children}
    </ConfigurationsContext.Provider>
  );
}

export function useConfigurationsSystem() {
  return useContext(ConfigurationsContext);
}
