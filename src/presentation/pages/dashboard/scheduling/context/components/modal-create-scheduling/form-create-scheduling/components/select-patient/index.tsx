import { useEffect } from "react";

import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import {
  useLoadAllPatientTutor,
  useLoadSchedulesPatients,
} from "@/presentation";

export function SelectPatient() {
  const { values, setFieldError, initialValues } = useFormikContext<any>();

  const patientTutors = useLoadAllPatientTutor({});

  const { data, isFetching } = useLoadSchedulesPatients({
    patientFilters: {
      tutor: patientTutors?.data?.find(
        (tutor) => tutor.id === values.holderId[0]
      )?.name,
    },
  });

  useEffect(() => {
    if (data && data.length === 0) {
      setFieldError("patientId", "Nenhum paciente encontrado.");
    }
  }, [data]);

  const hasInitialValue = initialValues["patientId"]

  return (
    <Select
      label="Paciente"
      loading={isFetching}
      name="patientId"
      isGroup={false}
      isMultiple={false}
      placeholder="Paciente"
      disabled={(data && data.length === 0) || hasInitialValue}
      options={
        data?.map((patient) => ({
          label: patient.name,
          value: patient.id,
        })) || []
      }
    />
  );
}
