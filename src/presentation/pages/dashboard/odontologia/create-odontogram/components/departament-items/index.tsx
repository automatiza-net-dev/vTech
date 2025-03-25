import { useFormikContext } from "formik";
import { api, useQuery } from "infinity-forge";

export function DepartamentItems() {
  const { values } = useFormikContext<{ departament: string | undefined }>();

  const {} = useQuery({
    queryKey: ["DepartamentItems", values?.departament],
    queryFn: async () => {
      return api({
        url: "departments/list-products-movements",
        method: "get",
        body: { departamentId: values?.departament },
      });
    },
    enabled: !!values.departament,
  });

  return (
    <>
      <div style={{ width: "100%" }}>
        <div className={"items-container"}>
          {/* {departament.itens.map((item) => (
            <S.ItemCard
              key={item.description}
              onClick={() =>
                setItensSelected((prev) =>
                  prev.some((i) => i.description === item.description)
                    ? prev.filter((i) => i.description !== item.description)
                    : [...prev, item]
                )
              }
              selected={itensSelected.some(
                (i) => i.description === item.description
              )}
            >
              <img src={item.image} alt={item.description} />
              <S.Checkbox
                type="checkbox"
                checked={itensSelected.some(
                  (i) => i.description === item.description
                )}
                readOnly
              />
            </S.ItemCard>
          ))} */}
        </div>
      </div>
    </>
  );
}
