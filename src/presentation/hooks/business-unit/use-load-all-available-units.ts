import { useQuery } from "infinity-forge";

import { RemoteBusinessUnits } from "@/data";
import { adminTypes, container } from "@/container";
import { useSystem } from "../users";

export function useLoadAllAvailableUnits() {
  const { unit } = useSystem();

  async function fetcher() {
    const response = await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .loadAllAvailableSwaps({ dashboard: true });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadAllAvailableUnits", unit?.id],
    queryFn: fetcher,
    enableCache: true
  });
}
