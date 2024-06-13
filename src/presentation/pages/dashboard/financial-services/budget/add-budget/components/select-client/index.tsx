import { Select } from "infinity-forge";

import { useLoadAllPatientTutor, useLoadPatient } from "@/presentation";

export function SelectClient() {
    const patient = useLoadPatient();
    const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

    return  <Select
    onlyOneValue
    label="Cliente"
    name="clientId"
    loading={patientTutor.isFetching}
    disabled={!!patient.data?.id}
    options={
      patientTutor.data?.map((tutor) => ({
        label: tutor.name,
        value: tutor.id,
      })) || []
    }
    creatableSelect
  />
}