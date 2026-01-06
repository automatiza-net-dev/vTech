import { Checkbox, Table } from "antd";

export const Columns = ({
  hasInternalCode,
  hasRelatedBills,
  hasGenerateBillDocuments,
  isVet,
  onToggleExpand,
  checkedKeys = [] as string[],
}) => [
  Table.EXPAND_COLUMN,
  {
    title: "",
    key: "controls",
    width: 20,
    render: (_, record) => <Checkbox checked={checkedKeys.includes(record.id)} onChange={() => onToggleExpand(record.id)} />,
  },
  {
    title: "Data da Venda",
    dataIndex: "bill_date",
    key: "bill_date",
  },
  {
    title: "Código",
    dataIndex: "code",
    key: "code",
  },
  hasInternalCode
    ? {
      title: "Código Interno",
      dataIndex: "internalCode",
      key: "internalCode",
    }
    : undefined,
  {
    title: "Cliente",
    dataIndex: "client",
    key: "client",
  },
  isVet ? {
    title: "Paciente",
    dataIndex: "patient",
    key: "patient",
  } : undefined,
  {
    title: "Funcionário",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "Valores em aberto",
    dataIndex: "missingValue",
    key: "missingValue",
  },

  hasRelatedBills
    ? {
      title: "Tipo Venda Relacionada",
      dataIndex: "billRelatedTypeDescription",
      key: "billRelatedTypeDescription",
    }
    : undefined,
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "N.F",
    dataIndex: "fn",
    key: "fn",
  },
  hasGenerateBillDocuments ? {
    title: "Status Doc.",
    dataIndex: "docActions",
    key: "docActions",
  } : undefined,
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
].filter(Boolean);
