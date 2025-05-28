import { useQuery } from "@/presentation/use-query";

import { RemoteControllerRole } from "@/data";
import { adminTypes, container } from "@/container";

export function useRolesControllers(props?: { filters: any }) {
  async function fetcher() {
    return await container.get<RemoteControllerRole>(adminTypes.RemoteControllerRole).loadAll(props?.filters);
  }

  return useQuery({
    queryKey: ["RemoteLoadAllControllerRoles", JSON.stringify(props?.filters)],
    queryFn: fetcher,
    enableCache: true
  });
}
