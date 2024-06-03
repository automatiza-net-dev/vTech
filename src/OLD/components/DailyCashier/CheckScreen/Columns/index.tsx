import { Switch } from "antd";

export const checkingCashierColumns = (func) => [
  {
    title: "Código Venda",
    key: "code",
    dataIndex: "code"
  },
  {
    title: "Bloco Pgto",
    key: "block",
    dataIndex: "block"
  },
  {
    title: "Pessoa",
    key: "client",
    dataIndex: "client"
  },
  {
    title: "Forma Pagamento / Bandeira",
    key: "paymentMethod",
    dataIndex: "paymentMethod"
  },
  {
    title: "NSU / Comprovante",
    key: "NSU",
    dataIndex: "NSU"
  },
  {
    title: "Qtd Parcelas",
    key: "installments",
    dataIndex: "installments"
  },
  {
    title: "Valor",
    key: "value",
    dataIndex: "value"
  },
  {
    title: () => (
      <div>
        Conferido<div>Conferir Todos</div>
        <div>
          <Switch onChange={(e) => func(e)} />
        </div>
      </div>
    ),
    key: "checked",
    dataIndex: "checked"
  }
];
