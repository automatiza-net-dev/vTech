import { BsCheck, BsX } from "react-icons/bs";
import { Checkbox, Tooltip } from "antd";

export const Columns = (selectAllFinances) => [
  {
    title: "Doc",
    dataIndex: "document",
    key: "document",
  },
  {
    title: "Parc",
    key: "parc",
    dataIndex: "parc",
  },
  {
    title: "Nota fiscal",
    dataIndex: "fiscalNote",
    key: "fiscalNote",
  },
  {
    title: "Pessoa",
    dataIndex: "client",
    key: "client",
  },
  {
    title: "Emissão",
    dataIndex: "issueDate",
    key: "issueDate",
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Dt. Venc.",
    dataIndex: "expirationDate",
    key: "expirationDate",
  },
  {
    title: "R$ Pgto",
    dataIndex: "paymentValue",
    key: "paymentValue",
  },
  {
    title: "Dt. Pgto",
    dataIndex: "paymentDate",
    key: "paymentDate",
  },
  {
    title: "Forma de pagamento",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Nº Comp./NSU",
    dataIndex: "nsu",
    key: "nsu",
  },
  {
    title: "Código interno",
    dataIndex: "internalCode",
    key: "internalCode",
  },
  {
    title: "Conf",
    dataIndex: "accept",
    key: "accept",
    render: (accept) =>
      accept === "SIM" ? (
        <BsCheck fontSize={25} />
      ) : accept === "NAO" ? (
        <BsX fontSize={25} />
      ) : null,
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
    key: "actions",
  },
];
