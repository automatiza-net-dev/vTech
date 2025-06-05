import { useQuery } from "infinity-forge"

import { RemoteBusinessUnits } from "@/data";
import { adminTypes, container } from "@/container";

export function useLoadAllStates() {


  async function fetcher() {
    const response = await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .loadAllStates();

    return response;

  }

  return useQuery({
    queryKey: ["LoadAllStates"],
    queryFn: fetcher,
    
  });
}
