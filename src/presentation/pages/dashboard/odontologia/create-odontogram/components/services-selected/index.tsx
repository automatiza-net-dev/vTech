import { useFormikContext } from "formik";
import { ItemDepartament } from "../../hooks";

import { Cart } from "@/presentation/pages/dashboard/financial-services";

import * as S from "./styles";
import { formatNumberToCurrency, useTable } from "infinity-forge";
import {
  InputQuantity,
  InputUnitaryValue,
  InputDiscount,
  InputTotal,
  InputCourtesy,
} from "@/presentation/pages/dashboard/financial-services/components/add-product/components";

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
      <div className="top">
        <div className="services_informations">
          <h3 className="font-16-regular">Itens Adicionados</h3>

          <span className="font-16-regular">
            {values?.cart?.reduce(
              (reducer, item) =>
                reducer +
                item?.variations?.reduce(
                  (reducer, item) => Number(item.quantity) + Number(reducer),
                  0
                ),
              0
            )}{" "}
            itens
          </span>

          <span className="font-16-regular">
            total:{" "}
            {formatNumberToCurrency(
              values?.cart?.reduce(
                (reducer, item) =>
                  reducer +
                  item?.variations?.reduce(
                    (reducer, item) => Number(item?.total) + Number(reducer),
                    0
                  ),
                0
              )
            )}
          </span>
        </div>

        {((values?.cart && values?.cart?.length > 0) ||
          (values?.departamentItems &&
            values?.departamentItems?.length > 0)) && (
          <div style={{ display: "flex", gap: 20 }}>
            {values?.departamentItems &&
              values?.departamentItems?.length > 0 && (
                <button
                  type="button"
                  className="font-14-bold"
                  onClick={() => setFieldValue("departamentItems", [])}
                >
                  Limpar Itens Selecionados
                </button>
              )}

            {values?.cart && values?.cart?.length > 0 && (
              <button
                type="button"
                className="font-14-bold"
                onClick={() => setFieldValue("cart", [])}
              >
                Limpar Orçamentos
              </button>
            )}
          </div>
        )}
      </div>

      {values?.cart && values?.cart?.length > 0 && (
        <div>
          <GroupCart agrouppedCart={agrouppedCart} cart={values.cart} />
        </div>
      )}
    </S.ServicesSelected>
  );
}

function GroupCart({
  cart,
  agrouppedCart,
}: {
  cart: Cart[];
  agrouppedCart: { [key: string]: Cart[] };
}) {
  const { Table } = useTable<{
    id: string;
    productName: string;
    quantity: number;
    total: string;
    items: Cart[];
  }>({
    columnsConfiguration: {
      columns: [
        { id: "productName", label: "Serviço", width: 200 },
        { id: "quantity", label: "Quantidade", width: 50 },
        { id: "total", label: "Total", width: 1500 },
      ],
      childrens: {
        childrenKey: "items",
        columns: [
          {
            id: "departamentDescription",
            label: "Departamento",
            Component: {
              Element: (props) => {
                console.log(props);

                return (
                  <p className="font-16-regular">
                    {props?.variations?.[0]?.departamentDescription}
                  </p>
                );
              },
            },
          },
          {
            id: "quantity",
            label: "Quantidade",
            Component: {
              Element: (props) => {
                const indexProduct = cart.findIndex(
                  (item) =>
                    item?.variations?.[0]?.departmentItemId ===
                    props?.variations?.[0]?.departmentItemId
                );

                const pathName = `cart[${indexProduct}].variations[0]`;

                const propsInput = {
                  indexProduct: indexProduct,
                  indexVariation: 0,
                  pathName: pathName,
                  product: props,
                  variation: props?.variations?.[0],
                };

                return <InputQuantity {...propsInput} />;
              },
            },
          },
          {
            id: "unitaryValue",
            label: "R$ Unitario",
            Component: {
              Element: (props) => {
                const indexProduct = cart.findIndex(
                  (item) =>
                    item?.variations?.[0]?.departmentItemId ===
                    props?.variations?.[0]?.departmentItemId
                );

                const pathName = `cart[${indexProduct}].variations[0]`;

                const propsInput = {
                  indexProduct: indexProduct,
                  indexVariation: 0,
                  pathName: pathName,
                  product: props,
                  variation: props?.variations?.[0],
                };

                return <InputUnitaryValue {...propsInput} />;
              },
            },
          },
          {
            id: "discountValue",
            label: "R$ Desconto",
            Component: {
              Element: (props) => {
                const indexProduct = cart.findIndex(
                  (item) =>
                    item?.variations?.[0]?.departmentItemId ===
                    props?.variations?.[0]?.departmentItemId
                );

                const pathName = `cart[${indexProduct}].variations[0]`;

                const propsInput = {
                  indexProduct: indexProduct,
                  indexVariation: 0,
                  pathName: pathName,
                  product: props,
                  variation: props?.variations?.[0],
                };

                return <InputDiscount {...propsInput} />;
              },
            },
          },

          {
            id: "total",
            label: "R$ Total",
            Component: {
              Element: (props) => {
                const indexProduct = cart.findIndex(
                  (item) =>
                    item?.variations?.[0]?.departmentItemId ===
                    props?.variations?.[0]?.departmentItemId
                );

                const pathName = `cart[${indexProduct}].variations[0]`;

                const propsInput = {
                  indexProduct: indexProduct,
                  indexVariation: 0,
                  pathName: pathName,
                  product: props,
                  variation: props?.variations?.[0],
                };

                return <InputTotal {...propsInput} />;
              },
            },
          },
          {
            id: "courtesy",
            label: "Cortesia",
            Component: {
              Element: (props) => {
                const indexProduct = cart.findIndex(
                  (item) =>
                    item?.variations?.[0]?.departmentItemId ===
                    props?.variations?.[0]?.departmentItemId
                );

                const pathName = `cart[${indexProduct}].variations[0]`;

                const propsInput = {
                  indexProduct: indexProduct,
                  indexVariation: 0,
                  pathName: pathName,
                  product: props,
                  variation: props?.variations?.[0],
                };

                return <InputCourtesy {...propsInput} />;
              },
            },
          },
        ],
        omitEmptyList: true,
      },
    },
    configs: {
      tableData: Object.keys(agrouppedCart).map((item) => ({
        id: agrouppedCart[item]?.[0]?.variations?.[0]?.id,
        productName: agrouppedCart[item]?.[0]?.variations?.[0]?.description,
        items: agrouppedCart[item],
        total: formatNumberToCurrency(
          agrouppedCart[item]?.reduce(
            (reducer, item) =>
              reducer +
              item.variations.reduce(
                (reducer, i) => reducer + Number(i.total),
                0
              ),
            0
          )
        ),
        quantity: agrouppedCart[item]?.reduce(
          (reducer, item) =>
            reducer +
            item.variations.reduce(
              (reducer, i) => reducer + Number(i.quantity),
              0
            ),
          0
        ),
      })),
      errorMessage: "Não há grupos no momento",
    },
  });

  return Table;
}
