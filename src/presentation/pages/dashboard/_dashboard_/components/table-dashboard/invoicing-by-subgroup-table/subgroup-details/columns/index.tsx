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
      
    },
  },
  {
    id: "totalSales",
    label: "Valor venda",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props?.totalSales?.toFixed(2)}</span>,
      props: {},
      
    },
  },
  {
    id: "percentage",
    label: "%",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props?.percentage?.toFixed(2)}</span>,
      props: {},
      
    },
  },
];
