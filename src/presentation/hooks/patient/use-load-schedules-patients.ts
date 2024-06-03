import { useQuery } from "react-query";

import { callApiOneTime } from "@/presentation";
import { LoadSchedulesPatient } from "@/domain";
import { RemoteLoadSchedulesPatient } from "@/data";
import { container, patientTypes } from "@/container";

export function useLoadSchedulesPatients({
  patientFilters,
  needFilterToCallApi = false,
}: {
  patientFilters?: LoadSchedulesPatient.Params | null;
  needFilterToCallApi?: boolean;
}) {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadSchedulesPatient>(patientTypes.RemoteLoadSchedulesPatient)
      .load(patientFilters || {});

    return response;
  }

  return useQuery(["RemoteLoadSchedulesPatients", patientFilters], fetcher, {
    ...callApiOneTime,
    enabled: needFilterToCallApi ? !!patientFilters : true,
  });
}
