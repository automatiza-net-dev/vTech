import { useQuery } from "infinity-forge";

import { RemoteControllerRole } from "@/data";
import { adminTypes, container } from "@/container";

export function useRolesControllers(props?: { filters: any }) {
  async function fetcher() {
    return await container.get<RemoteControllerRole>(adminTypes.RemoteControllerRole).loadAll(props?.filters);
  }

  return useQuery({
    queryKey: ["RemoteLoadAllControllerRoles"],
    queryFn: fetcher,
    enableCache: true
  });
}
