import { useQuery } from "infinity-forge";

import { RemoteBusinessUnits } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

export function useLoadAllBusinessUsers() {
  async function fetcher() {
    return await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .loadAllUsers();
  }

  return useQuery({
    queryKey: ["useLoadAllBusinessUsers"],
    queryFn: fetcher,
    
  });
}
