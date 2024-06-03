import { useRouter } from "next/router";
import { createContext, useState, useEffect, useContext } from "react";

interface HValidation {
  history: string[];
  atualRoute: string;
  setHistory(data: string[]): void;
  back(): void;
}

const HistoryContext = createContext<HValidation>({} as HValidation);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const router  = useRouter();
  const { asPath, pathname, push } = router;

  const [history, setHistory] = useState<string[]>([]);

  function back() {
    for (let i = history.length - 2; i >= 0; i--) {
      const route = history[i];
      if (!route.includes("#") && route !== pathname) {
        push(route);

        const newHistory = history.slice(0, i);
        setHistory(newHistory);

        break;
      }
    }
  }

  useEffect(() => {
    if(router.isReady)
    setHistory((previous) => [...previous, asPath]);
  }, [asPath]);

  return (
    <HistoryContext.Provider
      value={{
        back,
        history,
        atualRoute: asPath,
        setHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HValidation {
  const context = useContext(HistoryContext);
  return context;
}
