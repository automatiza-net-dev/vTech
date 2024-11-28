import { useRouter } from "next/router";
import { useQuery } from "infinity-forge";

import { RemotePatientReports } from "@/data";
import { container, patientTypes } from "@/container";
import { LoadAllPatientReports } from "@/domain";

export function useLoadAllPatientReports() {
  const router = useRouter();

  async function fetcher() {
    const response = await container
      .get<RemotePatientReports>(patientTypes.RemotePatientReports)
      .loadAllPatientReports(router.query);
    return response;
  }

  const queryKey = useLoadAllPatientReportsKEY();

  return useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: true,
  });
}

export function useLoadAllPatientReportsKEY() {
  return "RemoteLoadAllPatientReports";
}
