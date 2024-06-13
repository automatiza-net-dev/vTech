import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { CreateBudget } from "@/domain";
import { useLoadAllPatientTutor, useLoadPatient } from "@/presentation";

export function SelectPatient() {
  const patient = useLoadPatient();
  const { values } = useFormikContext<CreateBudget.Params>();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const options =
    patientTutor.data
      ?.find((tutor) => tutor.id === values.clientId)
      ?.dependents.map((dependent) => ({
        label: dependent.name,
        value: dependent.id,
      })) || [];

  return (
    <Select
      loading={patientTutor.isFetching}
      onlyOneValue
      options={options}
      label="Paciente"
      name="patientId"
      disabled={!!patient.data?.id || !values.clientId}
    />
  );
}
