import { useState } from "react";

import { useFormikContext } from "formik";
import { ItemDepartament, useDepartamentItems } from "../../hooks";
import { Cart } from "@/presentation/pages/dashboard/financial-services";

import * as S from "./styles";

import { InputControl } from "infinity-forge/dist/ui/components/form/input-control/styles";

export function Services() {
  const [query, setQuery] = useState("");

  const { data } = useDepartamentItems();

  const { setFieldValue, values } = useFormikContext<{
    departament: string | undefined;
    departamentItems: ItemDepartament[];
    cart: Cart[];
  }>();

  if (!values.departament) {
    return <></>;
  }

  const services =
    data?.[0]?.products?.filter((item) =>
      item?.description?.toLowerCase()?.includes(query?.toLowerCase())
    ) || [];

  return (
    <S.Services>
      <InputControl $inputIconSize={20}>
        <input
          type="text"
          onChange={(ev) => setQuery(ev.target.value)}
          placeholder="Buscar..."
        />
      </InputControl>

      {Array.isArray(services) && services.length === 0 && (
        <p className="font-14-regular">Nenhum serviço encontrado</p>
      )}
      <div className="services-list">
        {services?.map((service) => (
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
                      o?.variations?.[0]?.departmentItemId !== item.id &&
                      o?.variations?.[0]?.productVariationId === service.id
                    );
                  })
                ) {
                  newOrcamento.push({
                    id: service.id || 0,
                    observation: "",
                    courtesy: false,
                    variations: [
                      {
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
                      },
                    ],
                  });
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
