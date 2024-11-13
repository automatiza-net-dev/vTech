import { useEffect } from "react";

import { Input, Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { Tutor } from "@/domain";

export function SelectBudgetPatient({ tutors }: { tutors: Tutor[] }) {
  const { values, setFieldValue, initialValues } = useFormikContext<Tutor>();
  const initialValue = initialValues["patientName"];

  const options =
    tutors
      ?.find((tutor) => tutor.id === values["clientId"])
      ?.dependents.map((dependent) => ({
        label: dependent.name,
        value: dependent.id,
      })) || [];

  useEffect(() => {
    if (options.length === 0) {
      setFieldValue("patientId", null);
    }
  }, [values["clientId"]]);

  return initialValue ? (
    <Input label="Paciente" name="patientName" disabled />
  ) : (
    <Select
      name="patientId"
      label="Paciente"
      placeholder="Selecionar Paciente"
      disabled={options.length === 0}
      onlyOneValue
      options={options}
    />
  );
}
