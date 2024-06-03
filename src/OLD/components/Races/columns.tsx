import { convertDate } from "@/OLD/utils/convertDate";

export const columns = () => {
  return [
    {
      title: "Raça",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Espécie",
      dataIndex: "specie",
      key: "specie",
      render: (specie) => specie?.description,
    },
    {
      title: "Tipo pelagem",
      dataIndex: "fur",
      key: "fur",
      render: (fur) =>
        fur?.replace("_", " ").toLowerCase() ?? "Pelagem não informada",
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
