import { useQuery } from "react-query";

import { RemoteBusinessUnits } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

export function useLoadAllAvailableUnits() {
  async function fetcher() {
    return await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .loadAllAvailableSwaps({ dashboard: true });
  }

  return useQuery({
    queryKey: "RemoteLoadAllAvailableUnits",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
