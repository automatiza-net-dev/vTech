import { useFormikContext } from "formik";
import { api, useQuery } from "infinity-forge";

export type Departament = {
  systemId: string;
  economicGroupId: string;
  businessUnitId: string;
  departmentId: string;
  description: string;
};

export function Departaments() {
  const { setFieldValue } = useFormikContext();

  const { data } = useQuery({
    queryKey: "departaments",
    queryFn: async () => {
      return api<Departament[]>({
        url: "departments",
        method: "get",
        body: { type: "sistema" },
      });
    },
  });

  return (
    <div className="departament-selection">
      {data?.map((dept) => (
        <button
          key={dept.id}
          type="button"
          className="button-select-departament"
          onClick={() => {
            setFieldValue("departament", dept.id);
            // setDepartament(dept);
            // setItensSelected([]);
          }}
        >
          <img src={dept.image} />
          {dept.description}
        </button>
      ))}
    </div>
  );
}
