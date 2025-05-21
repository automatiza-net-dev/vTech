import { useQuery } from "infinity-forge";

import { RemoteVaccine } from "@/data";
import { LoadVaccinesReport } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadVaccinesReport(params: LoadVaccinesReport.Params) {
  async function fetcher() {
    const response = await container
      .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
      .loadVaccinesReport(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllVaccinesReport"],
    queryFn: fetcher,
    enableCache: true
  });
}
