import { useQuery } from "@/presentation/use-query";

import { RemotePatientReports } from "@/data";
import { container, patientTypes } from "@/container";
import { LoadAllPatientReports } from "@/domain";

export function useLoadAllPatientReports(params: LoadAllPatientReports.Params) {
  async function fetcher() {
    const response = await container
      .get<RemotePatientReports>(patientTypes.RemotePatientReports)
      .loadAllPatientReports(params);
    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadAllPatientReports", JSON.stringify(params)],
    queryFn: fetcher,
    enabled: Object.keys(params).length > 0,
  });
}
