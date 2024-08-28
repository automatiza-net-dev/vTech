import { useQuery } from "react-query";

import { RemoteVaccine } from "@/data";
import { LoadVaccineProtocols } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllVaccinesProtocols(
  params: LoadVaccineProtocols.Params & { fetch: boolean }
) {
  async function fetcher() {
    if (params.fetch) {
      const response = await container
        .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
        .loadAllProtocols(params);

      return response;
    }
  }

  return useQuery({
    queryKey: ["LoadAllVaccineProtocols", params],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
