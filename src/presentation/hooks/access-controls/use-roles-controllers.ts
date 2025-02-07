import { useQuery } from "infinity-forge";

import { RemoteControllerRole } from "@/data";
import { adminTypes, container } from "@/container";

export function useRolesControllers() {
  async function fetcher() {
    return await container.get<RemoteControllerRole>(adminTypes.RemoteControllerRole).loadAll();
  }

  return useQuery({
    queryKey: "RemoteLoadAllControllerRoles",
    queryFn: fetcher,
    enableCache: true
  });
}
