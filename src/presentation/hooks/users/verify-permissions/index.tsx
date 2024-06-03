import { useMe } from "@/presentation/hooks"

export function useVerifyPermissions(hash: string) {
  const { data } = useMe();

  return data?.cl?.includes(hash)
}
