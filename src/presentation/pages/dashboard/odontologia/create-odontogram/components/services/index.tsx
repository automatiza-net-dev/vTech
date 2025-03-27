import { FormHandler, Input } from "infinity-forge";

import {
  DepartmentItem,
  ItemDepartament,
  ProductDepartament,
  useDepartamentItems,
} from "../../hooks";
import { useFormikContext } from "formik";

export function Services() {
  const { data } = useDepartamentItems();

  const { setFieldValue, values } = useFormikContext<{
    departamentItems: ItemDepartament[];
    services: {
      departamentItem: ItemDepartament;
      service: ProductDepartament;
    }[];
  }>();

  return (
    <>
      <div style={{ width: 300 }}>
        <div className="services-container">
          <FormHandler initialData={{ query: "" }}>
            <Input name="query" placeholder="Buscar" />
          </FormHandler>

          {data?.[0]?.products?.map((service) => (
            <button
              key={service.description}
              type="button"
              className="service-button font-14-regular"
              onClick={() => {
                let newOrcamento: {
                  departamentItem: ItemDepartament;
                  service: ProductDepartament;
                }[] = values?.services || [];

                console.log(values.departamentItems)

                values.departamentItems.forEach((item) => {
                  if (
                    !newOrcamento.some((o) => {
                      console.log(
                        o.departamentItem.id === item.id,
                        o.service.id === service.id, "@@"
                      );

                      return (
                        o.departamentItem.id === item.id &&
                        o.service.id === service.id
                      );
                    })
                  ) {
                    newOrcamento.push({ departamentItem: item, service });
                  }
                });

                setFieldValue("services", newOrcamento);
              }}
            >
              {service.description}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
