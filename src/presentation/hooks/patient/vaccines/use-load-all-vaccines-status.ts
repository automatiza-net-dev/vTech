import { useQuery } from "infinity-forge";

import { RemoteVaccine } from "@/data";
import { LoadAllVaccinesStatus } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllVaccinesStatus(params: LoadAllVaccinesStatus.Params) {
  async function fetcher() {
    const response = await container
      .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
      .loadAllVaccinesStatus(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllVaccinesStatus", params],
    queryFn: fetcher,
    enableCache: true
  });
}
