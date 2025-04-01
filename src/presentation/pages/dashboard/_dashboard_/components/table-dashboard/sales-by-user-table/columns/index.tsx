import { Column } from "infinity-forge";
import { SalesUser } from "@/domain";

export const columns: Column<SalesUser>[] = [
  {
    id: "name",
    label: "Usuário",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.name}</span>,
      props: {},
      
    },
  },
  {
    id: "total",
    label: "Total",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props.total}</span>,
      props: {},
      
    },
  },
  {
    id: "qty",
    label: "Qtd",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props.qty}</span>,
      props: {},
      
    },
  },
  {
    id: "avg",
    label: "Tkt Méd.",
    hasAsc: false,
    width: 70,
    Component: {
      Element: (props) => <span>{props.avg}</span>,
      props: {},
      
    },
  },
  {
    id: "percentage",
    label: "%",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props.percentage}</span>,
      props: {},
      
    },
  },
];
