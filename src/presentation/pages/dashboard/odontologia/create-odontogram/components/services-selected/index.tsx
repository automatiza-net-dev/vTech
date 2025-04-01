import {
  Icon,
  useTable,
  formatNumberToCurrency,
  Tooltip,
} from "infinity-forge";
import { useFormikContext } from "formik";

import {
  InputTotal,
  InputCourtesy,
  InputDiscount,
  InputQuantity,
  InputUnitaryValue,
} from "@/presentation/pages/dashboard/financial-services/components/add-product/components";
import { Cart } from "@/presentation/pages/dashboard/financial-services";

import { ItemDepartament } from "../../hooks";

import * as S from "./styles";

export function ServicesSelected() {
  const { values } = useFormikContext<{
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
      <GroupCart agrouppedCart={agrouppedCart} cart={values?.cart} />
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
  const { values } = useFormikContext<{
    departamentItems: ItemDepartament[];
    cart: Cart[];
  }>();

  const { Table } = useTable<{
    id: string;
    productName: string;

    items: Cart[];
  }>({
    columnsConfiguration: {
      columns: [
        {
          id: "id",
          label: "Itens adicionados",
          ComponentTHead: {
            Element: ({ tableItems }) => {
              return (
                <span className="font-12-bold uppercase">
                  Itens adicionados
                  {/* <button
                    type="button"
                    className="font-14-bold"
                    onClick={() => setFieldValue("cart", [])}
                  >
                    Limpar Orçamentos
                  </button> */}
                </span>
              );
            },
          },
          Component: {
            Element: (props) => {
              const { setFieldValue } = useFormikContext();
              return (
                <span className="action-button">
                  <Tooltip
                    idTooltip="action"
                    enableHover
                    trigger={
                      <button
                        type="button"
                        className="action-button"
                        onClick={() => {
                          for (const item of props.items) {
                            setFieldValue(
                              "cart",
                              values.cart.filter((c) => item.id !== c.id)
                            );
                          }
                        }}
                      >
                        <Icon name="IconDelete" />
                      </button>
                    }
                    position="top-center"
                    content={"Remover serviço"}
                  />
                </span>
              );
            },
          },
        },
        { id: "productName", label: "Serviço" },
        {
          id: "id",
          label: "Quantidade",
          ComponentTHead: {
            Element: ({ tableItems }) => {
              return (
                <span className="font-12-bold uppercase">
                  {tableItems?.reduce(
                    (reducer, item) =>
                      reducer +
                      item.items.reduce(
                        (reducer, i) =>
                          reducer +
                          Number(
                            i.variations.reduce(
                              (r, v) => r + Number(v.quantity),
                              0
                            )
                          ),
                        0
                      ),
                    0
                  )}{" "}
                  itens
                </span>
              );
            },
          },
          Component: {
            Element: (props) => {
              return (
                <div>
                  {props.items.reduce(
                    (subtotal, i) =>
                      subtotal +
                      i.variations.reduce(
                        (sum, v) => sum + (Number(v.quantity) || 0),
                        0
                      ),
                    0
                  )}
                </div>
              );
            },
          },
        },
        {
          id: "id",
          label: "Total",
          ComponentTHead: {
            Element: ({ tableItems }) => {
              return (
                <span className="font-12-bold uppercase">
                  Total{" "}
                  {formatNumberToCurrency(
                    tableItems?.reduce(
                      (total, item) =>
                        total +
                        item.items.reduce(
                          (subtotal, i) =>
                            subtotal +
                            i.variations.reduce(
                              (sum, v) => sum + (Number(v.total) || 0),
                              0
                            ),
                          0
                        ),
                      0
                    ) || 0
                  )}
                </span>
              );
            },
          },
          Component: {
            Element: (props) => {
              return (
                <div>
                  {formatNumberToCurrency(
                    props.items.reduce(
                      (subtotal, i) =>
                        subtotal +
                        i.variations.reduce(
                          (sum, v) => sum + (Number(v.total) || 0),
                          0
                        ),
                      0
                    )
                  )}
                </div>
              );
            },
          },
        },
      ],
      childrens: {
        childrenKey: "items",
        getChildrenData: () => ({ enabled: false }),
        columns: [
          {
            id: "departamentDescription",
            label: "Departamento",
            Component: {
              Element: (props) => {
                console.log(props);

                return (
                  <p className="font-14-regular">
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
      })),
      errorMessage: "Não há grupos no momento",
    },
  });

  return Table;
}
