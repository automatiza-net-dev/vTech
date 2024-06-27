import { useState } from "react";

import { useFormikContext } from "formik";
import { DatePickerInput, Select } from "infinity-forge";

export function InputDeath() {
  const { setFieldValue } = useFormikContext();
  const [deathDate, setDeathDate] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "18px" }}>
      <Select
        label="O paciente veio a óbito?"
        name="death"
        options={[
          {
            label: "Sim",
            value: "true",
          },
          {
            label: "Não",
            value: "false",
          },
        ]}
        onlyOneValue
        onChangeSelect={(value) => {
          if ((value as string) === "true") {
            setDeathDate(true);
          } else {
            setDeathDate(false);
            setFieldValue("deathDate", undefined);
          }
        }}
      />

      {deathDate && (
        <DatePickerInput hasIcon name="deathDate" label="Data do óbito" typePicker="normal" />
      )}
    </div>
  );
}
