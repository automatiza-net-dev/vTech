

type QueryStoreProps<T = any> = {
  event?: string
  debugMode?: boolean;
  cache?: { [key: string]: QueryState<T> }
  queryClient?: any
}

export type FetcherParams = { get?: () => QueryStoreState }

export type IntervalTime =
  | "2s"
  | "5s"
  | "10s"
  | "20s"
  | "30s"
  | "1min"
  | "3min" | false;

export type QueryState<T = any> = {
  data?: T
  loading?: boolean;
  isFetching?: boolean
  isLoading?: boolean
  mutate?: (params?: FetcherParams & any) => void
  refetch: (key?: any, options?: {
    mode?: "exact" | "include";
    onSuccess?: (data: T) => void;
    onError?: (err: any) => void;
  }) => Promise<void>
  error?: any
  changeCache?: (data: any) => void
  mutateAsync?: (params?: FetcherParams & any) => void
}

export type QueryOptions = {
  enableCache?: boolean
  interval?: IntervalTime
  enabled?: boolean
}
interface QueryStoreState<T = any> extends QueryStoreProps {
  clearCache?: () => void
  refetch: (value?: string, configs?: { mode?: "include" | "exact" }) => Promise<void>
  clearCacheBySubstring?: (value: string) => void
  mutate?: (key: string, value?: QueryState<T>) => QueryState<any>
  invalidateQueries: (key: any) => Promise<void>
}

type useQueryProps<T> = {
  onSuccess?: (data: Awaited<T>) => void;
  onError?: (error: unknown) => void;
  isMutation?: boolean;
  queryKey: any[];
  queryFn: (params?: any) => Promise<T>;
  interval?: IntervalTime | number | false;
  enableCache?: boolean;
  enabled?: boolean;
  [key: string]: any;
};


export type { QueryStoreProps, useQueryProps, QueryStoreState }
