import { useQuery } from "react-query";

import { RemotePatient } from "@/data";
import { Patient } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllPatientVaccines(patient: Patient) {
  async function fetcher() {
    const response = await container
      .get<RemotePatient>(TypesAutomatiza.RemotePatient)
      .loadAllPatientVaccines({ patient: patient.id });

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllPatientVaccines", patient.id],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
