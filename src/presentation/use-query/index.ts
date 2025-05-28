
import {
  QueryClient as BaseQueryClient,
} from "@tanstack/react-query";

import {useQueryClient as useQueryClientBase} from "./use-query/context"
import {useQuery as useQUeryBase} from "./use-query"
import {useMutation as useQueryMutaiton} from "./use-query/use-mutation"

export const QueryClient = BaseQueryClient;
export const useQueryClient = useQueryClientBase;
export const useQuery = useQUeryBase;
export const useMutation = useQueryMutaiton;