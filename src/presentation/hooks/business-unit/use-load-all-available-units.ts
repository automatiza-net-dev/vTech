import { useQuery, useAuthAdmin } from "infinity-forge";

import { RemoteBusinessUnits } from "@/data";
import { adminTypes, container } from "@/container";

export function useLoadAllAvailableUnits() {
  const { user } = useAuthAdmin();

  async function fetcher() {
    const response = await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .loadAllAvailableSwaps({ dashboard: true });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadAllAvailableUnits", user?.unit?.id],
    queryFn: fetcher,
    enableCache: true
  });
}
