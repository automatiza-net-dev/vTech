import { useEffect, useState } from "react";

import moment from "moment";
import { useFormikContext } from "formik";
import { Input, InputSwitch, Select } from "infinity-forge";

import * as S from "./styles";

export function InputBirthday({ patientId }) {
  const [datepickerType, setDatepickerType] = useState("normal");

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values && values["birthMonths"]) {
      setDatepickerType("month");
      setFieldValue("birthDate_change", true);
    } else {
      setFieldValue("birthDate_change", false);
    }
  }, []);

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

          <Input type="number" name="birthDays" label="Idade dias" min={0} />
        </div>
      )}
      {!patientId && (
        <div>
          <InputSwitch
            label="Idade"
            onChangeInput={(ev) => {
              setDatepickerType(ev ? "month" : "normal");

              if (ev === true) {
                setFieldValue("birthDate", undefined);
              } else {
                setFieldValue("birthYears", undefined);
                setFieldValue("birthMonths", undefined);
                setFieldValue("birthDays", undefined);
              }
            }}
            name="birthDate_change"
          />
        </div>
      )}
    </S.InputBirthday>
  );
}
