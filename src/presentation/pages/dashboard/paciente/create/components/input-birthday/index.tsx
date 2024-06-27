import { useEffect, useState } from "react";

import moment from "moment";
import { useFormikContext } from "formik";
import { Input, InputSwitch, Select } from "infinity-forge";

import * as S from "./styles";

export function InputBirthday() {
  const [datepickerType, setDatepickerType] = useState("normal");

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if(values && values["birthMonths"]) {
      setDatepickerType("month")
    }
  }, [])

  return (
    <S.InputBirthday>
      {datepickerType === "normal" ? (
        <Input
          name="birthDate"
          type="date"
          label="Data de nascimento"
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
        </div>
      )}

      <div>
        <InputSwitch
          label="Idade"
          onChangeInput={(ev) => {
            setDatepickerType(ev ? "month" : "normal");

            if (ev === true) {
              setFieldValue("birthDate", undefined);
            }
          }}
          name="birthDate_change"
        />
      </div>
    </S.InputBirthday>
  );
}
