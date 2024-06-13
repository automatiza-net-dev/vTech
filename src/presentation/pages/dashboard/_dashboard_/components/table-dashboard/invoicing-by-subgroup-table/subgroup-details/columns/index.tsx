import { Column } from "infinity-forge";
import { SubgroupsDetails } from "@/domain";

export const columns: Column<SubgroupsDetails>[] = [
  {
    id: "description",
    label: "Subgrupo",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.description}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "qtySales",
    label: "Qtd",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.qtySales}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "totalSales",
    label: "Valor venda",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.totalSales}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "percentage",
    label: "%",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.percentage}</span>,
      props: {},
      allProps: true,
    },
  },
];
