import { useState } from "react";

import { useFormikContext } from "formik";
import { Input, Select } from "infinity-forge";

import { Tutor } from "@/domain";

export function SelectBudgetClient({
  tutors,
  origin,
}: {
  tutors: Tutor[];
  origin: "budget" | "bill";
}) {
  const [clientExists, setClientExists] = useState<boolean>(true);

  const { initialValues, setValues } = useFormikContext<Tutor>();
  const initialValue = initialValues["clientName"];

  return initialValue ? (
    <Input label="" name="clientName" disabled />
  ) : (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "50%" }}>
        <label style={{ color: "black", marginRight: "10px" }}>Cliente</label>
        {origin === "budget" && (
          <>
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
          </>
        )}
      </div>
      {clientExists ? (
        <Select
          onlyOneValue
          isClearable={true}
          label=""
          name="clientId"
          options={tutors?.map((tutor) => ({
            label: tutor?.name,
            value: tutor?.id,
          }))}
        />
      ) : (
        <Input name="clientName" label="" />
      )}
    </div>
  );
}
