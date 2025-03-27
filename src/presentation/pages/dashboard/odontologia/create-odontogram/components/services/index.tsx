import { useFormikContext } from "formik";
import { ItemDepartament, useDepartamentItems } from "../../hooks";
import { Cart } from "@/presentation/pages/dashboard/financial-services";

import * as S from "./styles";

export function Services() {
  const { data } = useDepartamentItems();

  const { setFieldValue, values } = useFormikContext<{
    departament: string | undefined;
    departamentItems: ItemDepartament[];
    cart: Cart[];
  }>();

  if (!values.departament) {
    return <></>;
  }

  return (
    <S.Services>
      <div className="services-container">
        {data?.[0]?.products?.map((service) => (
          <button
            key={service.description}
            type="button"
            className="service-button font-14-regular"
            onClick={() => {
              let newOrcamento = values?.cart || [];

              values.departamentItems.forEach((item) => {
                if (
                  !newOrcamento.some((o) => {
                    return (
                      o.departmentItemId !== item.id && o.id === service.id
                    );
                  })
                ) {
                  newOrcamento.push({
                    id: service.product_variation_id,
                    price: service.price,
                    courtesy: service.courtesy,
                    departamentDescription: item.description,
                    observation: "",
                    productDescription: service?.description,
                    departmentId: Number(values.departament || "0"),
                    departmentItemId: item.id,
                  } as Cart);
                }
              });

              setFieldValue("cart", newOrcamento);
            }}
          >
            {service.description}
          </button>
        ))}
      </div>
    </S.Services>
  );
}
