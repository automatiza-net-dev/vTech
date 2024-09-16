import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { CreateBudget } from "@/domain";
import { useLoadAllPatientTutor, useLoadPatient } from "@/presentation";

export function SelectClient() {
  const { initialValues } = useFormikContext<CreateBudget.Params>();

  const patient = useLoadPatient();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  return (
    <Select
      onlyOneValue
      label="Cliente"
      name="clientId"
      loading={patientTutor.isFetching}
      disabled={!!patient.data?.id || !!initialValues?.clientId}
      options={
        patientTutor.data?.map((tutor) => ({
          label: tutor.name,
          value: tutor.id,
        })) || []
      }
    />
  );
}
