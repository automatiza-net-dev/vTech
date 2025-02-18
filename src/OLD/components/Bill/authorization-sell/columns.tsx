import { Input, InputCurrency, InputSwitch } from "infinity-forge";

export const AUTH_COLUMNS = ({ cancelled }: { cancelled?: boolean }) => [
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
        render: Cancel,
      }
    : {},
];

function Cancel(item) {
  return (
    <div className="uk-flex" style={{ gap: "10px", alignItems: "center" }}>
      <InputSwitch name={`billItems[${item.index}].active`} />

      <div style={{ display: "none" }}>
        <Input
          name={`billItems[${item.index}].billItemId`}
          controlledInitialValue={{ value: item.id }}
        />
      </div>

      <InputCurrency
        label="Quantidade a ser cancelada"
        controlledInitialValue={{ value: item.quantity }}
        prefix=" "
        name={`billItems[${item.index}].quantity`}
        max={item.quantity}
      />
    </div>
  );
}

export const paymentsColumns =  ({cancelled}) => [
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
  cancelled
  ? {
      title: "Cancelar",
      render: CancelPayment,
    }
  : {},
];


function CancelPayment(item) {
  return (
    <div className="uk-flex" style={{ gap: "10px", alignItems: "center" }}>
      <InputSwitch name={`billPayments[${item.index}].active`} />

      <div style={{ display: "none" }}>
        <Input
          name={`billPayments[${item.index}].id`}
          controlledInitialValue={{ value: item.id }}
        />
      </div>
    </div>
  );
}