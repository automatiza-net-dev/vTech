import { useFormikContext } from "formik";
import { ItemDepartament, useDepartamentItems } from "../../hooks";

import * as S from "./styles";
import { Departament } from "../departaments";

export function DepartamentItems() {
  const { data } = useDepartamentItems();

  const { values, setFieldValue } = useFormikContext<{
    departament: number;
    departamentItems: ItemDepartament[];
  }>();

  const departamentItems = values?.departamentItems;

  console.log(values.departament, "de");

  return (
    <S.DepartamentItems>
      <div
        className={"items-container"}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${
            values?.departament === 4 ? 16 : values?.departament === 3 ? 2 : 1
          }, 1fr)`,
        }}
      >
        {data?.[0]?.items?.map((item) => (
          <div
            key={item.description}
            className="item-card"
            onClick={() => {
              setFieldValue(
                "departamentItems",
                departamentItems?.some((i) => i.id === item.id)
                  ? departamentItems?.filter((i) => i.id !== item.id)
                  : [...(departamentItems || []), item]
              );
            }}
          >
            <img src={item.photo} alt={item.description} />
            <input
              type="checkbox"
              checked={departamentItems?.some((i) => i.id === item.id)}
              readOnly
            />
          </div>
        ))}
      </div>
    </S.DepartamentItems>
  );
}
