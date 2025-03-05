import { useAuthAdmin } from "infinity-forge";

export function useMe() {
  const { user } = useAuthAdmin();

  return { data: user }
}
