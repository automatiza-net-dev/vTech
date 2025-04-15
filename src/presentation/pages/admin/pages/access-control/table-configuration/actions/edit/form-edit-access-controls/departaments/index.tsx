import { InputSwitch, Select } from "infinity-forge";
import { LoadRolesControllerSearch } from "@/domain";

import * as S from "./styles";
import { useFormikContext } from "formik";

export function Departaments() {
  const { values } = useFormikContext<LoadRolesControllerSearch.Model>();
  return (
    <S.Departaments>
      <h4>Departamentos</h4>

      <div className="list">
        {values?.profiles?.map((p, index) => {
          return (
            <InputSwitch
              key={p.id}
              design="checkbox"
              name={`profiles[${index}].active`}
              label={p.description}
            />
          );
        })}
      </div>
    </S.Departaments>
  );
}
