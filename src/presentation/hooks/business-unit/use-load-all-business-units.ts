import { useQuery } from "react-query";

import { RemoteBusinessUnits } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

export function useLoadAllBusinessUnits() {
  async function fetcher() {
    return await container.get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits).loadAll();
  }

  return useQuery({
    queryKey: "RemoteLoadAllBusinessUnits",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
