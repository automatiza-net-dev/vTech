import useSWR, {useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { QueryState } from "./types";

export type useQueryProps<T> = {
  onSuccess?: (data: Awaited<T>) => void;
  onError?: (error: unknown) => void;
  isMutation?: boolean;
  queryKey: any[];
  queryFn: (params?: any) => T;
  interval?: false | string | number;
  enableCache?: boolean;
  enabled?: boolean;
};

function parseInterval(interval: string | number | false): number | undefined {
  if (interval === false) return undefined;

  switch (interval) {
    case "2s": return 2000;
    case "5s": return 5000;
    case "10s": return 10000;
    case "20s": return 20000;
    case "30s": return 30000;
    case "1min": return 60000;
    case "3min": return 180000;
    default: return typeof interval === "number" ? interval : undefined;
  }
}

export function useQuery<T>({
  queryFn,
  onSuccess,
  onError,
  interval = false,
  queryKey,
  enableCache = true,
  enabled = true,
  isMutation,
}: useQueryProps<T>) {
  const key = JSON.stringify(queryKey);
  const { mutate: globalMutate } = useSWRConfig();

  const revalidateInterval = parseInterval(interval);

  const changeCache = (data: Awaited<T>) => {
    globalMutate(key, data, false);
  };

  if (isMutation) {
    const { trigger, data, error, isMutating } = useSWRMutation(
      key,
      async (_key, { arg }) => {
        try {
          const result = await queryFn(arg);
          onSuccess?.(result);
          return result;
        } catch (err) {
          onError?.(err);
          throw err;
        }
      }
    );

    return {
      data,
      error,
      isLoading: isMutating,
      isFetching: isMutating,
      loading: isMutating,
      mutate: trigger,
      mutateAsync: trigger,
      refetch: trigger,
      changeCache,
    } as Required<QueryState<Awaited<T>>>;
  }

  const swr = useSWR(
    enabled ? key : null,
    async () => {
      try {
        const res = await queryFn(queryKey?.[1]);
        onSuccess?.(res);
        return res;
      } catch (err) {
        onError?.(err);
        throw err;
      }
    },
    {
      refreshInterval: revalidateInterval,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const mutateAsync = async (params?: any) => {
    const newKey = JSON.stringify([queryKey[0], params]);
    const result = await queryFn(params);
    globalMutate(newKey, result, false);
    return result;
  };

  return {
    data: swr.data,
    loading: swr.isLoading,
    error: swr.error,
    isFetching: swr.isValidating,
    isLoading: swr.isLoading,
    mutate: mutateAsync,
    mutateAsync,
    refetch: swr.mutate,
    changeCache,
  } as Required<QueryState<Awaited<T>>>;
}
