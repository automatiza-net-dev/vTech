import { Input, Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { Tutor } from "@/domain";

export function SelectBudgetPatient({ tutors }: { tutors: Tutor[] }) {
  const { values, initialValues } = useFormikContext<Tutor>();
  const initialValue = initialValues["patientName"];

  const options =
    tutors
      ?.find((tutor) => tutor.id === values["clientId"])
      ?.dependents.map((dependent) => ({
        label: dependent.name,
        value: dependent.id,
      })) || [];

  return initialValue ? (
    <Input label="Paciente" name="patientName" disabled />
  ) : (
    <Select
      name="patientId"
      label="Paciente"
      placeholder="Selecionar Paciente"
      disabled={initialValue}
      onlyOneValue
      options={options}
    />
  );
}
