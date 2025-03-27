import { useFormikContext } from "formik";
import { ItemDepartament } from "../../hooks";

import { Cart } from "@/presentation/pages/dashboard/financial-services";

import * as S from "./styles";
import { useTable } from "infinity-forge";

export function ServicesSelected() {
  const { setFieldValue, values } = useFormikContext<{
    departamentItems: ItemDepartament[];
    cart: Cart[];
  }>();

  const agrouppedCart = values.cart.reduce((reducer, cartItem) => {

    const groupName = cartItem.id;
    const actualGroup = reducer?.[groupName] || [];

    return {...reducer, [groupName]: [...actualGroup, cartItem]}
  }, {})

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
        <div className="orcamento-container">
          {Object.keys(agrouppedCart).map((orc) => (
            <GroupCart key={orc} agrouppedCart={agrouppedCart} />
          ))}
        </div>
      )}
    </S.ServicesSelected>
  );
}

function GroupCart({ agrouppedCart }: { agrouppedCart: { [key: string]: Cart[] } }) {

  //pegar os itns e fazer usbitems porém fazer uma estrutura em que possar ser lido o nome da categoria em uma linha com algumas informações e poder expadir com os itens do carrinho
  const {} = useTable({ columnsConfiguration: { columns: [{ label: "" }] }, configs: { disableRoutingUpdateFilters: Object.keys() } })


  return <></>
}


{/* <div key={index} className="orcamento-item" style={{ gap: 20 }}>
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
</div> */}