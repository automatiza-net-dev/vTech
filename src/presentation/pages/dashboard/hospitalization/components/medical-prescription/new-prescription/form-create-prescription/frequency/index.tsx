import { useEffect } from "react";

import { useFormikContext } from "formik";
import { Input, InputCurrency, InputDatePicker, Select } from "infinity-forge";

export function Frequency() {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    if (values.frequency !== "RECURRENT") {
      setFieldValue("frequencyInterval", undefined);
      setFieldValue("frequencyUnit", undefined);
      setFieldValue("frequencyQuantity", undefined);
      setFieldValue("frequencyQuantityUnit", undefined);
    }
  }, [values.frequency]);

  return (
    <div className="row">
      <div className="row">
        <InputDatePicker
          label="Inicio da execução"
          mode="date"
          language="pt"
          name="executionStart"
        />

        <Input label="Horário de inicio" type="time" name="executionHour" />
      </div>

      {values.frequency === "RECURRENT" && (
        <>
          <div className="row">
            <InputCurrency
              prefix=" "
              name="frequencyInterval"
              label="A Cada"
              controlledInitialValue={{ value: values?.frequencyInterval }}
            />

            <Select
              onlyOneValue
              label="Unidade"
              name="frequencyUnit"
              options={[
                { label: "Horas", value: "HOUR" },
                { label: "Dias", value: "DAY" },
              ]}
            />
          </div>

          <div className="row">
            <InputCurrency
              prefix=" "
              name="frequencyQuantity"
              label="Por"
              controlledInitialValue={{ value: values?.frequencyQuantity }}
            />

            <Select
              onlyOneValue
              label="Unidade"
              name="frequencyQuantityUnit"
              options={[
                { label: "Horas", value: "HOUR" },
                { label: "Dias", value: "DAY" },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
