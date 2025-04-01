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

export function Departaments() {
  const { values, setFieldValue } = useFormikContext<{
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
      <div className="list">
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
      </div>

      {values?.departamentItems && values.departamentItems.length > 0 && (
        <Tooltip
          idTooltip="action"
          enableHover
          trigger={
            <button
              type="button"
              className="font-14-bold action"
              onClick={() => setFieldValue("departamentItems", [])}
            >
              <svg
                width="60"
                height="80"
                viewBox="0 0 60 80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="6"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
                <line
                  x1="20"
                  y1="12"
                  x2="50"
                  y2="12"
                  stroke="black"
                  stroke-width="2"
                />

                <rect
                  x="4"
                  y="23"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
                <line
                  x1="20"
                  y1="29"
                  x2="50"
                  y2="29"
                  stroke="black"
                  stroke-width="2"
                />

                <rect
                  x="4"
                  y="40"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
                <line
                  x1="20"
                  y1="46"
                  x2="50"
                  y2="46"
                  stroke="black"
                  stroke-width="2"
                />
              </svg>
            </button>
          }
          position="top-center"
          content={"Limpar Itens Selecionados"}
        />
      )}
    </S.Departaments>
  );
}
