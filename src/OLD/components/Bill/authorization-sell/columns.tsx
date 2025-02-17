import { Input, InputCurrency, InputSwitch } from "infinity-forge";

export const AUTH_COLUMNS = ({
  cancelled,
  billItems,
  setBillItems,
}: {
  cancelled?: boolean;
  setBillItems;
  billItems;
}) => [
  {
    title: "Qtd.",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Cód.Produto",
    dataIndex: "productCode",
    key: "productCode",
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  !cancelled
    ? {
        title: "Preço Unitário Cadastro",
        dataIndex: "singleRegistragionPrice",
        key: "singleRegistragionPrice",
      }
    : {},
  {
    title: "Preço Unitário Vendido",
    dataIndex: "singleSellingPrice",
    key: "singleSellingPrice",
  },
  {
    title: "Desconto Concedido",
    dataIndex: "grantedDiscount",
    key: "grantedDiscount",
  },
  !cancelled
    ? {
        title: "Desconto Max",
        dataIndex: "maxDiscount",
        key: "maxDiscount",
      }
    : {},
  {
    title: "Total Item",
    dataIndex: "totalItem",
    key: "totalItem",
  },
  {
    title: "Cortesia",
    dataIndex: "courtesy",
    key: "courtesy",
  },
  !cancelled
    ? {
        title: "Autorização",
        dataIndex: "authorization",
        key: "authorization",
      }
    : {},

  cancelled
    ? {
        title: "Cancelar",

        render: (item) => {
          console.log(item);
          return (
            <div className="uk-flex" style={{ gap: "10px" }}>
              <InputSwitch
                name={"billItems" + item.id}
                onChangeInput={(value) => {
                  const bill = { billItemId: item.id };

                  if (!value) {
                    setBillItems((state) => {
                      const removeItem = state?.filter(
                        (billItem) => billItem.billItemId !== item.id
                      );

                      return removeItem;
                    });

                    return;
                  }

                  setBillItems((state) => {
                    const billItems = state ? [...state, bill] : [bill];

                    return billItems;
                  });
                }}
              />

              {billItems?.find(
                (billItem) => billItem.billItemId === item.id
              ) && (
                <InputCurrency
                  controlledInitialValue={{ value: item.quantity }}
                  prefix=" "
                  name={"quantity" + item.id}
                  max={item.quantity}
                  onChangeInput={(value) => {}}
                />
              )}
            </div>
          );
        },
      }
    : {},
];

export const paymentsColumns = [
  {
    title: "Data",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Forma pagamento",
    dataIndex: "paymentMethodDescription",
    key: "paymentMethod",
  },
  {
    title: "Comprovante/NSU",
    dataIndex: "nsu",
    key: "nsu",
  },
  {
    title: "Dados Autorização",
    dataIndex: "authorization",
    key: "authorization",
  },
];
