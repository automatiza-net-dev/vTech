import { parseJSON } from "infinity-forge";
import React, {
  createContext,
  useContext,
  useMemo,
  PropsWithChildren,
} from "react";
import { SWRConfig, useSWRConfig } from "swr";

interface QueryClientHelpers {
  refetch: (
    key: string | any[],
    options?: { mode?: "exact" | "include" }
  ) => Promise<void>;
  invalidateQueries: (key: string) => Promise<void>;
  clearCache: () => void;
  mutate: (key: string, data: any) => void;
}

const QueryClientContext = createContext<QueryClientHelpers | null>(null);

export function QueryClientContextProvider({
  children,
}: PropsWithChildren<{}>) {
  return (
    <SWRConfig value={{}}>
      <InnerQueryClientProvider>{children}</InnerQueryClientProvider>
    </SWRConfig>
  );
}

function InnerQueryClientProvider({ children }: PropsWithChildren) {
  const { cache, mutate } = useSWRConfig();

  const helpers = useMemo<QueryClientHelpers>(
    () => ({
      async refetch(key, options) {
        const keys = Array.from(cache.keys()) as string[];

        const matchedKeys = keys.filter((k) => {
          try {
            const parsedKey = parseJSON(k);
            if (!Array.isArray(parsedKey)) return false;

            return parsedKey[0] === key[0];
          } catch {
            return false;
          }
        });

        await Promise.all(matchedKeys.map((k) => mutate(k)));
      },

      async invalidateQueries(key) {
        this.refetch(key);
      },

      clearCache() {
        for (const key of cache.keys()) {
          cache.delete(key);
        }
      },

      mutate(key, data) {
        mutate(key, data, false);
      },
    }),
    [cache]
  );

  return (
    <QueryClientContext.Provider value={helpers}>
      {children}
    </QueryClientContext.Provider>
  );
}

export function useQueryClient(): any;
export function useQueryClient<SelectorReturn>(
  selector: (client: any) => SelectorReturn
): SelectorReturn;
export function useQueryClient<SelectorReturn>(
  selector?: (client: any) => SelectorReturn
): SelectorReturn | any {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error("Missing QueryClientContext.Provider");
  }

  return selector ? selector(context) : context;
}
