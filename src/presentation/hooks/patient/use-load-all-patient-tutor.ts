import { useQuery } from "infinity-forge";

import { RemoteTutor } from "@/data";
import { LoadAllPatientTutor } from "@/domain";
import { container, patientTypes } from "@/container";
import { useScheduling } from "@/presentation/pages";

export function useLoadAllPatientTutor({
  enabled = true,
  patientFilters = null,
}: {
  enabled?: boolean;
  patientFilters?: LoadAllPatientTutor.Params | null;
} = {}) {
  async function fetcher() {
    const response = await container
      .get<RemoteTutor>(patientTypes.RemoteTutor)
      .loadAll(patientFilters || {});
    return response;
  }

  const queryKey = useLoadAllPatientTutorKEY(patientFilters);

  return useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: enabled,
  });
}

export function useLoadAllPatientTutorKEY(
  patientFilters?: LoadAllPatientTutor.Params | null
) {
  const contextPatientFilters = useScheduling((state) => state.patientsFilters);

  const filters = patientFilters || contextPatientFilters;

  return ["RemoteLoadAllPatientTutor", (filters ? JSON.stringify(filters) : "")];
}
