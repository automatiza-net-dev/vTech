import { QueryOptions as QueryOptionsInfinity, QueryState } from "./types";
import * as tanstack from '@tanstack/react-query';

export type useQueryProps<T> = {
  onSuccess?: (data: Awaited<T>) => void;
  onError?: (error: unknown) => void;
  isMutation?: boolean;
  queryKey: any[],
  queryFn: (params?: any) => T;
} & QueryOptionsInfinity;

export function useQuery<T>({
  queryFn,
  onSuccess,
  onError,
  interval = false,
  queryKey,
  enableCache,
  enabled = true,
  isMutation,
  ...rest
}: useQueryProps<T>) {
  const queryClient = tanstack.useQueryClient();

  const cache = enableCache
    ? { staleTime: Infinity, gcTime: Infinity }
    : {};

  function parseInterval(interval): number | false {
    switch (interval) {
      case "2s": return 2000;
      case "5s": return 5000;
      case "10s": return 10000;
      case "20s": return 20000;
      case "30s": return 30000;
      case "1min": return 60000;
      case "3min": return 180000;
      default: return interval;
    }
  }

  const refetchInterval = parseInterval(interval);

  function changeCache(data: any) {
    queryClient.setQueryData(queryKey, data);
  }

  if (isMutation) {
    const mutation = tanstack.useMutation({
      mutationKey: queryKey,
      mutationFn: async (params?: any) => {
        const res = await queryFn(params);
        onSuccess?.(res);
        return res;
      },
      onError,
      ...rest
    });

    return {
      loading: mutation.isPending,
      data: mutation.data,
      error: mutation.error,
      isFetching: mutation.isPending,
      isLoading: mutation.isPending,
      mutate: mutation.mutateAsync,
      refetch: mutation.mutateAsync,
      mutateAsync: mutation.mutateAsync,
      changeCache,
    } as Required<QueryState<Awaited<T>>>;
  }

  const { data, error, isFetching, isLoading, refetch } = tanstack.useQuery({
    queryKey: queryKey,
    queryFn: async ({ queryKey }) => {
      try {
        const [_key, params] = queryKey;
        const res = await queryFn(params);
        onSuccess?.(res);
        return res;
      } catch (err) {
        onError?.(err)
      }
    },
    enabled,
    refetchInterval,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...cache,
    ...rest
  });

  function mutate(params?: any) {
    const newKey = [queryKey, params];
    return queryClient.fetchQuery({
      queryKey: newKey,
      queryFn: ({ queryKey }) => {
        const [_key, params] = queryKey;
        return queryFn(params);
      },
    }).then((res) => {
      queryClient.setQueryData(queryKey, res);
      return res;
    });
  }

  return {
    data,
    loading: isLoading,
    error,
    isFetching,
    isLoading,
    mutate,
    refetch,
    changeCache,
    mutateAsync: mutate,
  } as unknown as Required<QueryState<Awaited<T>>>;
}