import { useFormikContext } from "formik";
import { api, useQuery } from "infinity-forge";

export type Departament = {
  systemId: string;
  photo: string;
  economicGroupId: string;
  businessUnitId: string;
  departmentId: string;
  description: string;
};

import * as S from "./styles"

export function Departaments() {
  const { setFieldValue } = useFormikContext();

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
            // setDepartament(dept);
            // setItensSelected([]);
          }}
        >
          <img src={dept.photo} />

          {dept.description}
        </button>
      ))}
    </S.Departaments>
  );
}
