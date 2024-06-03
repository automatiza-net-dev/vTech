export const columns = [
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Tipo de serviço",
    dataIndex: "serviceGroup",
    key: "serviceGroup",
    render: (record) => record.description
  },
  {
    title: "Minutos reservados",
    dataIndex: "reserved_minutes",
    key: "reserved_minutes",
  },
  {
    title: "Permite retorno",
    dataIndex: "allowReturn",
    key: "allowReturn"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Criado em",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
  },
];
