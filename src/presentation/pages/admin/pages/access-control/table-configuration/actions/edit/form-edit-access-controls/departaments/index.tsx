import { Departament } from "@/domain";
import { Select } from "infinity-forge";

import * as S from "./styles";

export function Departaments({
  departaments,
}: {
  departaments: Departament[];
}) {
  if (!departaments || departaments?.length === 0) {
    return <></>;
  }

  return (
    <S.Departaments>
      <h4>Departamentos</h4>

      <div className="list">
        <Select
          name={`profileAccessIdList`}
          isMultiple
          options={
            departaments?.map((d) => ({
              label: d.descricao,
              value: d.idPerfil.toString(),
            })) || []
          }
        />
      </div>
    </S.Departaments>
  );
}
