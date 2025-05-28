import { useQuery, useQueryProps } from './index'

export function useMutation<T>(props: useQueryProps<T>) {
  return useQuery({ ...props, isMutation: true })
}