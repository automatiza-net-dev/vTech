import { useState } from "react";

import { useFormikContext } from "formik";
import { Input, Select } from "infinity-forge";

import { Tutor } from "@/domain";

export function SelectBudgetClient({ tutors }: { tutors: Tutor[] }) {
  const [clientExists, setClientExists] = useState<boolean>(true);

  const { initialValues, setValues } = useFormikContext<Tutor>();
  const initialValue = initialValues["clientName"];

  return initialValue ? (
    <Input label="Cliente" name="clientName" disabled />
  ) : (
    <>
      {clientExists ? (
        <Select
          onlyOneValue
          isClearable={true}
          label="Cliente"
          name="clientId"
          options={tutors?.map((tutor) => ({
            label: tutor?.name,
            value: tutor?.id,
          }))}
        />
      ) : (
        <Input name="clientName" label="Cliente (não existente na base)" />
      )}
      <div style={{ marginTop: "20px", width: "50%" }}>
        <input
          type="checkbox"
          onChange={(e) => {
            setClientExists(!e.target.checked);
            if (e.target.checked) {
              setValues((prv) => ({ ...prv, clientId: "" }));
            } else {
              setValues((prv) => ({ ...prv, clientName: "" }));
            }
          }}
        />{" "}
        <label>Cliente não cadastrado</label>
      </div>
    </>
  );
}
