import { convertDate } from "@/OLD/utils/convertDate";

export const columns = [
  {
    label: "Descrição",
    id: "description",
  },
  {
    label: "Tipo",
    id: "type",
  },
  {
    label: "Ativo",
    id: "active",
    Component: {
      Element: (props) => (props?.active ? "Sim" : "Não"),
      props: {},
      
    },
  },
  {
    label: "Criado em",
    id: "created_at",
    Component: {
      Element: (props) => convertDate(props?.created_at),
      props: {},
      
    },
  },
];
