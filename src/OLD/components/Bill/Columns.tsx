export const Columns = (hasInternalCode) => [
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
  hasInternalCode ? {
    title: "Código Interno",
    dataIndex: "internalCode",
    key: "internalCode",
  }: undefined,
  {
    title: "Cliente",
    dataIndex: "client",
    key: "client",
  },
  {
    title: "Paciente",
    dataIndex: "patient",
    key: "patient",
  },
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
   
  {
    title: "Tipo Venda Relacionada",
    dataIndex: "billRelatedTypeDescription",
    key: "billRelatedTypeDescription",
  },
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
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
].filter(Boolean);

export const LiftColumns =  (hasInternalCode) => [
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
  hasInternalCode ? {
    title: "Código Interno",
    dataIndex: "internalCode",
    key: "internalCode",
  } : {},
  {
    title: "Cliente",
    dataIndex: "client",
    key: "client",
  },
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
  {
    title: "N.F",
    dataIndex: "fn",
    key: "fn",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Status Doc.",
    dataIndex: "docActions",
    key: "docActions",
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
];
