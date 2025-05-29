

import {useQueryClient as useQueryClientBase} from "./use-query/context"
import {useQuery as useQUeryBase} from "./use-query"
import {useMutation as useQueryMutaiton} from "./use-query/use-mutation"

export const useQueryClient = useQueryClientBase;
export const useQuery = useQUeryBase;
export const useMutation = useQueryMutaiton;