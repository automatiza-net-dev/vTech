import { useEffect } from "react";

import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import {
  useLoadAllPatientTutor,
  useLoadSchedulesPatients,
} from "@/presentation";

export function SelectPatient() {
  const { values, setFieldError, initialValues } = useFormikContext<any>();

  const initialValue = [
    {
      label: initialValues?.["patientName"]?.[0],
      value: initialValues?.["patientId"]?.[0],
    },
  ];

  const patientTutors = useLoadAllPatientTutor({
    enabled: !initialValue,
  });

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

  return (
    <Select
      label="Paciente"
      loading={isFetching}
      name="patientId"
      isGroup={false}
      isMultiple={false}
      placeholder="Paciente"
      disabled={(data && data.length === 0) || !!initialValue}
      options={
        initialValue ||
        data?.map((patient) => ({
          label: patient.name,
          value: patient.id,
        })) ||
        []
      }
    />
  );
}
