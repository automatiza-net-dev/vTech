import { useState } from "react";

import { useFormikContext } from "formik";
import { Input, Select } from "infinity-forge";

import { Tutor } from "@/domain";

import * as S from "./styles";

export function SelectBudgetClient({
  tutors,
  hideCheckbox,
}: {
  tutors: Tutor[];
  hideCheckbox?: boolean;
}) {
  const [clientExists, setClientExists] = useState<boolean>(false);

  const { initialValues, setValues } = useFormikContext<Tutor>();
  const initialValue = initialValues["clientId"];
  const hasClientName = initialValues["clientName"];

  return initialValue ? (
    <Input label="Cliente" name="clientName" disabled />
  ) : (
    <S.SelectBudgetClient>
      {(hasClientName ? clientExists : !clientExists) ? (
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
        <Input name="clientName" label="Cliente" />
      )}
      {!hideCheckbox && (
        <div className="checkbox-box" style={{ marginTop: "20px" }}>
          <input
            type="checkbox"
            checked={hasClientName && !clientExists}
            onChange={(e) => {
              setClientExists(
                hasClientName ? !e.target.checked : e.target.checked
              );
              if (e.target.checked) {
                setValues((prv) => ({ ...prv, clientId: "", patientId: "" }));
              } else {
                setValues((prv) => ({
                  ...prv,
                  patientName: "",
                }));
              }
            }}
          />{" "}
          <label>Cliente não cadastrado</label>
        </div>
      )}
    </S.SelectBudgetClient>
  );
}
