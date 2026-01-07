import { Checkbox, Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import type { Key } from "react";

export const Columns = (props: {
  hasInternalCode: boolean;
  hasRelatedBills: boolean;
  hasGenerateBillDocuments: boolean;
  isVet: boolean;
  onToggleExpand: (rec: string) => void;
  checkedKeys: Key[];
}) =>
  [
    Table.EXPAND_COLUMN,
    {
      title: "",
      key: "controls",
      width: 20,
      render: (_, record) => (
        <Checkbox
          checked={props.checkedKeys.includes(record.id)}
          onChange={() => props.onToggleExpand(record.id)}
        />
      ),
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
    props.hasInternalCode
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
    props.isVet
      ? {
          title: "Paciente",
          dataIndex: "patient",
          key: "patient",
        }
      : undefined,
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

    props.hasRelatedBills
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
    props.hasGenerateBillDocuments
      ? {
          title: "Status Doc.",
          dataIndex: "docActions",
          key: "docActions",
        }
      : undefined,
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
    },
  ].filter(Boolean) as ColumnsType<any>;
