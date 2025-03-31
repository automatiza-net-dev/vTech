import { useFormikContext } from "formik";
import { api, useQuery } from "infinity-forge";

export type Departament = {
  systemId: string;
  image: string;
  economicGroupId: string;
  businessUnitId: string;
  departmentId: string;
  description: string;
};

import * as S from "./styles"
import { ItemDepartament } from "../../hooks";

export function Departaments() {
  const { setFieldValue } = useFormikContext<{
      departamentItems: ItemDepartament[];
    }>();

  const { data } = useQuery({
    queryKey: "departaments",
    queryFn: async () => {
      return api<Departament[]>({
        url: "departments/resume",
        method: "get",
        body: { type: "sistema" },
      });
    },
  });

  return (
    <S.Departaments>
      {data?.map((dept) => (
        <button
          key={dept.departmentId}
          type="button"
          className="button-select-departament"
          onClick={() => {
            setFieldValue("departament", dept.departmentId);
            setFieldValue("departamentItems", []);
          }}
        >
          <img src={dept?.image} />

          {dept.description}
        </button>
      ))}
    </S.Departaments>
  );
}
