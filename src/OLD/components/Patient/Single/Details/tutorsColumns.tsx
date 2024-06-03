export const Columns = [
  {
    title: "Tutor",
    key: "name",
    dataIndex: "name",
    render: (_, data) => (data?.is_main ? `${data?.name} - Ativo` : data?.name)
  },
  {
    title: "Telefone",
    key: "cellphone",
    dataIndex: "cellphone",
    render: (_, data) => data?.tutor?.cellphone
  },
  {
    title: "Email",
    key: "email",
    dataIndex: "email",
    render: (_, data) => data?.tutor?.email
  },
  {
    title: "Tutor ativo",
    key: "activeTutor",
    dataIndex: "activeTutor"
  }
];
