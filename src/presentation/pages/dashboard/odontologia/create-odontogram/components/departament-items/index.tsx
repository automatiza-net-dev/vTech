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
    <S.DepartamentItems>
     
        <div className={"items-container"}>
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
