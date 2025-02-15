import { useEffect, useState } from "react";

import moment from "moment";
import { useFormikContext } from "formik";
import { Input, Select, InputSwitch } from "infinity-forge";

import * as S from "./styles";

interface IInputBirthdayProps {
  patientId?: string;
  required: boolean;
}

export function InputBirthday({ patientId, required }: IInputBirthdayProps) {
  const [datepickerType, setDatepickerType] = useState("normal");

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values && values["birthMonths"]) {
      setDatepickerType("month");
    }
  }, []);

  return (
    <S.InputBirthday>
      {datepickerType === "normal" ? (
        <Input
          name="birthDate"
          type="date"
          label={`Data de nascimento${required ? "*" : ""}`}
          max={moment().format("YYYY-MM-DD")}
        />
      ) : (
        <div className="select_year">
          <Input type="number" name="birthYears" label="Idade Anos" />

          <Select
            options={Array.from({ length: 11 }).map((_, index) => ({
              label: index + 1 + (index === 0 ? " mês" : " meses"),
              value: String(index + 1),
            }))}
            onlyOneValue
            name="birthMonths"
            label="Idade meses"
          />

          <Input type="number" name="birthDays" label="Idade dias" min={0} />
        </div>
      )}

      {!patientId && (
        <div style={{ width: "150px" }}>
          <InputSwitch
            name="birthDate_change"
            type="checkbox"
            label={`informar idade${required ? "*" : ""}`}
            onChangeInput={(value) => {
              setDatepickerType(value ? "month" : "normal");

              if (value) {
                setFieldValue("birthDate", undefined);
              } else {
                setFieldValue("birthYears", undefined);
                setFieldValue("birthMonths", undefined);
                setFieldValue("birthDays", undefined);
              }
            }}
          />
        </div>
      )}
    </S.InputBirthday>
  );
}
