import { useFormikContext } from "formik";
import { ItemDepartament, useDepartamentItems } from "../../hooks";

import * as S from "./styles";

export function DepartamentItems() {
  const { data } = useDepartamentItems();

  const { values, setFieldValue } = useFormikContext<{
    departamentItems: ItemDepartament[];
  }>();

  const departamentItems = values?.departamentItems;

  return (
    <>
      <div style={{ width: "100%" }}>
        <div className={"items-container"}>
          {data?.[0]?.items?.map((item) => (
            <S.ItemCard
              key={item.description}
              onClick={() => {
                setFieldValue(
                  "departamentItems",
                  departamentItems?.some((i) => i.id === item.id)
                    ? departamentItems?.filter((i) => i.id !== item.id)
                    : [...(departamentItems || []), item]
                );
              }}
              selected={departamentItems?.some((i) => i.id === item.id)}
            >
              <img src={item.photo} alt={item.description} />
              <S.Checkbox
                type="checkbox"
                checked={departamentItems?.some((i) => i.id === item.id)}
                readOnly
              />
            </S.ItemCard>
          ))}
        </div>
      </div>
    </>
  );
}
