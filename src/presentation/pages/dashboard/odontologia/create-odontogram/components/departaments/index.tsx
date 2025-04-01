import { useFormikContext } from "formik";
import { api, Tooltip, useQuery } from "infinity-forge";

export type Departament = {
  systemId: string;
  image: string;
  economicGroupId: string;
  businessUnitId: string;
  departmentId: string;
  description: string;
};

import * as S from "./styles";
import { ItemDepartament } from "../../hooks";
import { useEffect } from "react";

export function Departaments() {
  const { values, setFieldValue } = useFormikContext<{
    departament?: number;
    departamentItems: ItemDepartament[];
  }>();

  const { data } = useQuery({
    queryKey: "departaments",
    queryFn: async () => {
      const response = await api<Departament[]>({
        url: "departments/resume",
        method: "get",
        body: { type: "sistema" },
      });

      return response
    },
  });

  useEffect(() => {
    if(!values.departament) {
      setFieldValue("departament", data?.[0]?.departmentId);
      setFieldValue("departamentItems", []);
    }
  }, [])

  return (
    <S.Departaments>
      <div className="list">
        {data?.map((dept) => (
          <button
            key={dept.departmentId}
            type="button"
            className={"button-select-departament " + ((String(values?.departament) === String(dept.departmentId)) ? "active" : "")}
            onClick={() => {
              setFieldValue("departament", dept.departmentId);
              setFieldValue("departamentItems", []);
            }}
          >
            <img src={dept?.image} />

            {dept.description}
          </button>
        ))}
      </div>
    </S.Departaments>
  );
}
