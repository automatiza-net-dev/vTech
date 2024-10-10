import { useState, createContext } from "react";

export const AppContext = createContext<{
  titles?: any;
  setTitles?: any;
  originConfig?: any;
  setOriginConfig?: any;
  crmData?: any;
  setCrmData?: any;
}>({});

export const AppProvider = ({ children }) => {
  const [titles, setTitles] = useState([]);
  const [crmData, setCrmData] = useState(false);

  const [originConfig, setOriginConfig] = useState("");

  return (
    <AppContext.Provider
      value={{
        titles,
        setTitles,

        originConfig,
        setOriginConfig,

        crmData,
        setCrmData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
