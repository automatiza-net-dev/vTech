import { Tooltip, Checkbox } from "antd";

export const columns = (selectAll) => [
  { title: "Doc", key: "doc", dataIndex: "doc" },
  { title: "Parc", key: "installments", dataIndex: "installments" },
  {
    title: "Forma de pagamento",
    key: "paymentMethod",
    dataIndex: "paymentMethod"
  },
  { title: "Bandeira", key: "flag", dataIndex: "flag" },
  { title: "Valor original", key: "originalValue", dataIndex: "originalValue" },
  { title: "% Tarifa", key: "feePercentage", dataIndex: "tariffPercentage" },
  { title: "R$ Tarifa", key: "feeValue", dataIndex: "tariffValue" },
  { title: "Valor", key: "value", dataIndex: "value" },
  { title: "Nº Comp./NSU", key: "nsu", dataIndex: "nsu" },
  {
    title: (
      <>
        Ações&nbsp;
        <Tooltip title="Selecionar todos">
          <Checkbox onChange={(e) => selectAll(e.target.checked)} />
        </Tooltip>
      </>
    ),
    dataIndex: "actions",
    key: "actions"
  }
];
