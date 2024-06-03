import { ButtonSetSchedulling } from "./button-set-scheduling";

export const columnsTable = [
  { id: "name", label: "Nome", width: 100 },
  { id: "email", label: "Email", width: 100 },
  {
    id: "tag",
    label: "Tag",
    width: 100,
  },
  {
    id: "cellphone",
    label: "Celular",
    width: 100,
  },
  {
    id: "agendamento",
    label: "",
    width: 100,
    Component: {
      Element: ButtonSetSchedulling,
      props: { agendamento: "agendamento" },
      defaultProps: {},
      allProps: true,
    },
  },
];
