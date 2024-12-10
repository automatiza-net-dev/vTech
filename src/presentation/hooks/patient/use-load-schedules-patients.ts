import { useQuery } from "infinity-forge";

import { useScheduling } from "@/presentation";
import { LoadSchedulesPatient } from "@/domain";
import { RemoteLoadSchedulesPatient } from "@/data";
import { container, patientTypes } from "@/container";

type PatientFilterProps = (LoadSchedulesPatient.Params & { fetch?: boolean }) | null

export function useLoadSchedulesPatients({
  patientFilters,
}: {
  patientFilters?: PatientFilterProps;
}) {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadSchedulesPatient>(patientTypes.RemoteLoadSchedulesPatient)
      .load(patientFilters || {});

    return response;
  }

  const queryKey = useLoadSchedulesPatientsKEY(patientFilters);

  return useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: patientFilters?.fetch,
  });
}

export function useLoadSchedulesPatientsKEY(patientFilters?: PatientFilterProps) {
  const contextPatientFilters = useScheduling((state) => state.patientsFilters);

  return ["RemoteLoadSchedulesPatients", JSON.stringify(patientFilters || contextPatientFilters)]
}