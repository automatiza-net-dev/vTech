import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { CreateBudget } from "@/domain";
import { useLoadAllPatientTutor, useLoadPatient } from "@/presentation";
import { useEffect } from "react";

export function SelectPatient() {
  const patient = useLoadPatient();
  const { values, initialValues, setFieldValue } = useFormikContext<CreateBudget.Params>();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const options =
    patientTutor.data
      ?.find((tutor) => tutor.id === values.clientId)
      ?.dependents.map((dependent) => ({
        label: dependent.name,
        value: dependent.id,
      })) || [];

  useEffect(() => {
    if (options.length === 0) {
      setFieldValue("patientId", undefined);
    }
  }, [options.length]);

  return (
    <Select
      loading={patientTutor.isFetching}
      onlyOneValue
      options={options}
      label="Paciente"
      name="patientId"
      disabled={!!patient.data?.id || !values.clientId || options.length === 0 || !!initialValues?.patientId}
    />
  );
}
