import { useState } from "react";

import { useFormikContext, useField } from "formik";
import { InputDatePicker, Select } from "infinity-forge";

export function InputDeath() {
  const [field] = useField("deathDate");
  const { setFieldValue } = useFormikContext();
  const [deathDate, setDeathDate] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "18px",
      }}
    >
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

      {(field.value || deathDate) && (
        <InputDatePicker
          name="deathDate"
          label="Data do óbito"
          mode="date"
          language="pt"
          readOnly
          date={{}}
        />
      )}
    </div>
  );
}
