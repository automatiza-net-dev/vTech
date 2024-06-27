import { useEffect } from "react";

import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { CreateBudget } from "@/domain";
import { useLoadAllPatientTutor, useLoadPatient } from "@/presentation";

export function SelectPatient() {
  const patient = useLoadPatient();
  const { values, setFieldValue } = useFormikContext<CreateBudget.Params>();
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const options =  patientTutor.data
  ?.find((tutor) => tutor.id === values.clientId)
  ?.dependents.map((dependent) => ({
    label: dependent.name,
    value: dependent.id,
  })) || []

  useEffect(() =>  {
    if(values.clientId && options.length === 0) {
      setFieldValue("patientId", "")
    }
  }, [values.clientId])

  return (
    <Select
      key={values.clientId}
      onlyOneValue
      options={
        options
      }
      label="Paciente"
      name="patientId"
      disabled={!!patient.data?.id || !values.clientId}
    />
  );
}
