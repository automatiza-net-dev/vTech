import { BsCheck, BsX } from "react-icons/bs";
import { Checkbox, Tooltip } from "antd";

export const Columns = (selectAllFinances) => [
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Doc",
    dataIndex: "document",
    key: "document"
  },
  {
    title: "Parc",
    key: "parc",
    dataIndex: "parc"
  },
  {
    title: "Pessoa",
    dataIndex: "client",
    key: "client"
  },
  {
    title: "Dt. emissão",
    dataIndex: "issueDate",
    key: "issueDate"
  },
  {
    title: "Dt. Venc.",
    dataIndex: "expirationDate",
    key: "expirationDate"
  },
  {
    title: "R$ Total",
    dataIndex: "value",
    key: "value"
  },
  {
    title: "R$ Realizado",
    dataIndex: "paymentValue",
    key: "paymentValue"
  },
  {
    title: "Dt. Pagamento",
    dataIndex: 'paymentDate',
    key: 'paymentDate'
  },
  {
    title: "Forma de pagamento",
    dataIndex: "paymentMethod",
    key: "paymentMethod"
  },
  {
    title: "Nº Comp./NSU",
    dataIndex: "nsu",
    key: "nsu"
  },
  {
    title: (
      <>
        Ações&nbsp;
        <Tooltip title="Selecionar todos">
          <Checkbox onChange={(e) => selectAllFinances(e.target.checked)} />
        </Tooltip>
      </>
    ),
    dataIndex: "actions",
    key: "actions"
  }
];
