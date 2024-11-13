import { Input, Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { Tutor } from "@/domain";

export function SelectBudgetClient({ tutors }: { tutors: Tutor[] }) {
  const { initialValues } = useFormikContext<Tutor>();
  const initialValue = initialValues["clientName"];

  return initialValue ? (
    <Input label="Cliente" name="clientName" disabled />
  ) : (
    <Select
      onlyOneValue
      label="Cliente"
      name="clientId"
      options={tutors?.map((tutor) => ({
        label: tutor?.name,
        value: tutor?.id,
      }))}
    />
  );
}
