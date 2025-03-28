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
                      o?.variations?.[0]?.departmentItemId !== item.id && o?.variations?.[0]?.productVariationId === service.id
                    );
                  })
                ) {
                  newOrcamento.push({
                    id: service.id ||  0,
                    observation: "",
                    courtesy: false,
                    variations: [{
                      id: String(Math.random()),
                      quantity: 1,
                      maximum_discount_percentage: 0,
                      saleValue: service.price || 0,
                      total: service.price || 0,
                      unitaryValue: service.price || 0,
                      discountValue: 0,
                      productVariationId: service.product_variation_id || 0,
                      courtesy: false,
                      departmentItemId: item.id,
                      departamentDescription: item.description,
                      departmentId: Number(values.departament || "0"),
                      description: service?.description,
                    }]
                  })
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
