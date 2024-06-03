import { useQuery } from "react-query";

import { RemotePatient } from "@/data";
import { Patient } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllVaccines(patient: Patient) {
  async function fetcher() {
    const response = await container
      .get<RemotePatient>(TypesAutomatiza.RemotePatient)
      .loadAllVaccines({ patient: patient.id });

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllVaccines", patient.id],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
