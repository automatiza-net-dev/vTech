import { useFormikContext } from "formik";
import { Select, Icon } from "infinity-forge";

import { Unit } from "./unit";
import {  useLoadAllBusinessUnitsSystem } from "@/presentation";

import * as S from "./styles";

export function InputAddUnit() {
  const { values, setFieldValue, setFieldError } = useFormikContext<any>();

  const { data } = useLoadAllBusinessUnitsSystem();

  const selectUnit = values.selectUnit;

  function addUnit() {
    const existUnit = values?.units?.find((unit: any) => unit === selectUnit);

    if (existUnit) {
      setFieldError("selectUnit", "Unidade já existente na lista atual.");

      return;
    }

    if (!selectUnit) {
      setFieldError("selectUnit", "Selecione uma unidade.");

      return;
    }

    setFieldValue(
      "units",
      values.units && Array.isArray(values.units) && values.units.length > 0
        ? [...values.units, selectUnit]
        : [selectUnit]
    );

    setFieldError("selectUnit", "");
  }

  return (
    <S.InputAddUnit>
      <div className="select-unit-container">
        {data && (
          <Select
            name="selectUnit"
            label="Unidades"
            placeholder="Unidades"
            onlyOneValue
            options={
              data?.map((item) => ({
                label: item?.economicGroup?.company_name,
                value: item.id,
              })) || []
            }
          />
        )}

<button
              type="button"
              onClick={addUnit}
              className={!selectUnit ? "disabled" : ""}
            >
              <Icon name="IconPlusSharp" color="#000" />
            </button>
      </div>

      {values?.units?.map((unit) => {
        return (
          <Unit
            key={unit}
            remove={(unit) => {
              setFieldValue(
                "units",
                values.units.filter((u) => u !== unit)
              );
            }}
            businessUnitId={unit}
          />
        );
      })}
    </S.InputAddUnit>
  );
}
