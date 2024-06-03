import { convertDate } from "@/OLD/utils/convertDate";

export const columns = () => {
  return [
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Ativo",
      dataIndex: "active",
      key: "active",
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => convertDate(createdAt),
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
    },
  ];
};
