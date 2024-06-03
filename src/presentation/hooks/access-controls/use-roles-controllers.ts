import { useQuery } from "react-query";

import { RemoteControllerRole } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

export function useRolesControllers() {
  async function fetcher() {
    return await container.get<RemoteControllerRole>(adminTypes.RemoteControllerRole).loadAll();
  }

  return useQuery({
    queryKey: "RemoteLoadAllControllerRoles",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
