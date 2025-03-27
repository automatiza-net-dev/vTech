import { useFormikContext } from "formik";
import { ItemDepartament } from "../../hooks";

import { Cart } from "@/presentation/pages/dashboard/financial-services";

import * as S from "./styles";
import { formatNumberToCurrency, useTable } from "infinity-forge";

export function ServicesSelected() {
  const { setFieldValue, values } = useFormikContext<{
    departamentItems: ItemDepartament[];
    cart: Cart[];
  }>();

  const agrouppedCart = values.cart.reduce((reducer, cartItem) => {
    const groupName = cartItem.id;
    const actualGroup = reducer?.[groupName] || [];

    return { ...reducer, [groupName]: [...actualGroup, cartItem] };
  }, {});

  return (
    <S.ServicesSelected>
      {((values?.cart && values?.cart?.length > 0) ||
        (values?.departamentItems && values?.departamentItems?.length > 0)) && (
        <div className="top">
          {values?.departamentItems && values?.departamentItems?.length > 0 && (
            <button
              type="button"
              className="font-12-bold"
              onClick={() => setFieldValue("departamentItems", [])}
            >
              Limpar Itens Selecionados
            </button>
          )}

          {values?.cart && values?.cart?.length > 0 && (
            <button
              type="button"
              className="font-12-bold"
              onClick={() => setFieldValue("cart", [])}
            >
              Limpar Orçamentos
            </button>
          )}
        </div>
      )}

      {values?.cart && values?.cart?.length > 0 && (
        <div>
 
            <GroupCart agrouppedCart={agrouppedCart} />
       
        </div>
      )}
    </S.ServicesSelected>
  );
}

function GroupCart({
  agrouppedCart,
}: {
  agrouppedCart: { [key: string]: Cart[] };
}) {
  const { Table } = useTable<{ productName: string; items: Cart[] }>({
    columnsConfiguration: {
      columns: [{ id: "productName", label: "Serviço" }],
      childrens: {
        childrenKey: "items",
        columns: [
          {
            id: "departamentDescription",
            label: "Departamento",
            Component: {
              Element: (props) => (
                <p className="font-16-regular">
                  {props?.variations?.[0]?.departamentDescription}
                </p>
              ),
            },
          },
          {
            id: "unitaryValue",
            label: "Preço",
            width: 900,
            Component: {
              Element: (props) => (
                <p className="font-16-regular">
                  {formatNumberToCurrency(props?.variations?.[0]?.unitaryValue || 0)}
                </p>
              ),
            },
          },
        ],
        omitEmptyList: true,
      },
    },
    configs: {
      tableData: Object.keys(agrouppedCart).map((item) => ({
        productName: agrouppedCart[item]?.[0]?.variations?.[0]?.description,
        items: agrouppedCart[item],
      })),
      errorMessage: "Não há grupos no momento",
    },
  });

  return Table;
}

{
  /* <div key={index} className="orcamento-item" style={{ gap: 20 }}>
<span className="font-14-regular">
  {orc?.departamentDescription} - {orc?.productDescription} - R${" "}
  {orc?.price}
</span>
<button
  type="button"
  onClick={() => {
    setFieldValue(
      "cart",
      values.cart.filter((_, i) => i !== index)
    );
  }}
  style={{
    background: "transparent",
    border: 0,
    color: "red",
  }}
>
  🗑️
</button>
</div> */
}
