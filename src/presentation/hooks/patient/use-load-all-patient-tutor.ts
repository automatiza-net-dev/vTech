import { useQuery } from "infinity-forge";

import { RemoteTutor } from "@/data";
import { LoadAllPatientTutor } from "@/domain";
import { container, patientTypes } from "@/container";
import { useScheduling } from "@/presentation/pages";

export function useLoadAllPatientTutor(props?: {
  modal?: boolean,
  enabled?: boolean;
  patientFilters?: LoadAllPatientTutor.Params | null;
} ) {
  async function fetcher() {
    const response = await container
      .get<RemoteTutor>(patientTypes.RemoteTutor)
      .loadAll(props?.patientFilters || {});
    return response;
  }

  const queryKey = useLoadAllPatientTutorKEY(props?.patientFilters, props?.modal);

  return useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: typeof props?.enabled !== "undefined" ? props.enabled : true
  });
}

export function useLoadAllPatientTutorKEY(
  patientFilters?: LoadAllPatientTutor.Params | null,
  modal?: boolean
) {
  const contextPatientFilters = useScheduling((state) => state.patientsFilters);

  const filters = patientFilters || contextPatientFilters;

  return ["RemoteLoadAllPatientTutor", (filters ? JSON.stringify(filters) : ""), modal];
}
