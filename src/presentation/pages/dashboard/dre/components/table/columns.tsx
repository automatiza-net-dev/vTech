import { DreGroup } from "@/domain";
import { Column } from "infinity-forge";

export const columns = [
  {
    id: "description",
    label: "Descrição",
    width: 100,
  },
  {
    id: "sequence",
    label: "Sequência",
    width: 70,
  },
  {
    id: "active",
    label: "Ativo",
    width: 30,
    Component: {
      Element: (props) => (props?.active ? "Sim" : "Não"),
      props: {},
      allProps: true,
    },
  },
] as Column<DreGroup>[];
