import { parseJSON } from "infinity-forge";
import { useSWRConfig } from "swr";

interface QueryClientHelpers {
  refetch: (
    key: string | any[],
    options?: { mode?: "exact" | "include" }
  ) => Promise<void>;
  invalidateQueries: (key: string | any[]) => Promise<void>;
  clearCache: () => void;
  mutate: (key: string, data: any) => void;
}

export function useQueryClient(): QueryClientHelpers {
  const { cache, mutate  } = useSWRConfig();

  return {
    async refetch(key, options) {
      const keys = Array.from(cache.keys()) as string[];

      const matchedKeys = keys.filter((k) => {
        try {
          const parsedKey = parseJSON(k);
          if (!Array.isArray(parsedKey)) return false;
          console.log(parsedKey,"parsed", (Array.isArray(key) ? key[0] : parseJSON(key)?.[0]))
          
          return parsedKey[0] === (Array.isArray(key) ? key[0] : parseJSON(key)?.[0]);
        } catch {
          return false;
        }
      });

      console.log(matchedKeys)

      await Promise.all(matchedKeys.map((k) => mutate(k)));
    },

    async invalidateQueries(key) {
      return this.refetch(key);
    },

    clearCache() {
      for (const key of cache.keys()) {
        cache.delete(key);
      }
    },

    mutate(key, data) {
      mutate(key, data, false);
    },
  };
}