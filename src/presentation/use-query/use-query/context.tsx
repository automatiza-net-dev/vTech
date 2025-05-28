import React, { createContext, useContext, useRef } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from "@tanstack/react-query";
import { createStore, useStore } from "zustand";

interface QueryStoreState {
  queryClient: QueryClient | null;
  setQueryClient: (qc: QueryClient) => void;
  refetch: (
    key: QueryOptions["queryKey"],
    options?: { mode?: "exact" | "include" }
  ) => Promise<void>;
  clearCache: () => void;
  mutate: (key: QueryOptions["queryKey"], data: any) => void;
  invalidateQueries: (key: any) => void;
}

const createQueryStore = () =>
  createStore<QueryStoreState>((set, get) => ({
    queryClient: null,
    setQueryClient: (qc) => set({ queryClient: qc }),
    refetch: async (key, options) => {
      const qc = get().queryClient;
      if (!qc) throw new Error("QueryClient não inicializado");

      const mode = options?.mode === "include" ? "include" : "exact";

      if (mode === "include") {
        await qc.invalidateQueries({
          predicate: (query) => {
            const queryKey = query?.queryKey;
            const targetKey = key?.[0];

            if (
              Array.isArray(queryKey) &&
              queryKey.length > 0 &&
              typeof queryKey[0] === "string" &&
              typeof targetKey === "string"
            ) {
              return queryKey[0].startsWith(targetKey);
            }
            return false;
          },
        });
      } else {
        await qc.invalidateQueries({ queryKey: key, exact: mode === "exact" });
      }
    },
    invalidateQueries: async (key: any) => {
      const qc = get().queryClient;
      if (!qc) throw new Error("QueryClient não inicializado");

      console.log(key, "kk")
      if (
        Array.isArray(key) &&
        key.length === 1 &&
        typeof key[0] === "string"
      ) {
        await qc.invalidateQueries({
          predicate: (query) => {
            const queryKey = query?.queryKey;
            const targetKey = key[0];

            return (
              Array.isArray(queryKey) &&
              typeof queryKey[0] === "string" &&
              queryKey[0].startsWith(targetKey)
            );
          },
        });
      } else {
        await qc.invalidateQueries({ queryKey: key, exact: true });
      }
    },
    clearCache: () => {
      const qc = get().queryClient;
      if (!qc) return;
      qc.clear();
    },
    mutate: (key: any, data) => {
      const qc = get().queryClient;
      if (!qc) return;
      qc.setQueryData(key, data);
    },
  }));

type QueryStoreType = ReturnType<typeof createQueryStore>;

const QueryClientContext = createContext<QueryStoreType | null>(null);

const queryClient = new QueryClient();

function QueryClientContextProvider({ children }: React.PropsWithChildren<{queryClient: QueryClient}>) {
  const storeRef = useRef<QueryStoreType | null>(null);
  if (!storeRef.current) {
    storeRef.current = createQueryStore();
    storeRef.current.setState({ queryClient });
  }

  return (
    <QueryClientContext.Provider value={storeRef.current}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryClientContext.Provider>
  );
}

function useQueryClient<T = QueryStoreState>(
  selector?: (state: QueryStoreState) => T
): T {
  const store = useContext(QueryClientContext);
  if (!store)
    throw new Error("Missing QueryClientContext.Provider in the tree");

  const safeSelector = selector ?? ((state) => state as T);

  return useStore(store, safeSelector);
}

export { QueryClientContextProvider, useQueryClient };
