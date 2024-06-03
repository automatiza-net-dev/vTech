import AddIcon from "@mui/icons-material/Add";
import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { Unit } from "./unit";
import { Popover, useLoadAllBusinessUnits } from "@/presentation";

import * as S from "./styles";

export function InputAddUnit() {
  const { values, setFieldValue, setFieldError } = useFormikContext<any>();

  const { data } = useLoadAllBusinessUnits();

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
                label: item?.company_name,
                value: item.id,
              })) || []
            }
          />
        )}

        <Popover title="Adicionar" forceClose={!selectUnit}>
          <button
            type="button"
            onClick={addUnit}
            className={!selectUnit ? "disabled" : ""}
          >
            <AddIcon fontSize="small" color="info" />
          </button>
        </Popover>
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
