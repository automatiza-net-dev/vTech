import { useQuery } from "react-query";

import { RemoteTutor } from "@/data";
import { LoadAllPatientTutor } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadAllPatientTutor({ needFilterToCallApi = false, patientFilters }: {
  patientFilters?: LoadAllPatientTutor.Params | null;
  needFilterToCallApi?: boolean;
}) {
  async function fetcher() {
    const response = await container.get<RemoteTutor>(patientTypes.RemoteTutor).loadAll(patientFilters || {});

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadAllPatientTutor", patientFilters],
    queryFn: fetcher,
    ...callApiOneTime,
    enabled: needFilterToCallApi ? !!patientFilters : true,
  });
}
