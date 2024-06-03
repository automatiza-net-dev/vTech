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
      allProps: true,
    },
  },
  {
    id: "total",
    label: "Total",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.total}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "qty",
    label: "Qtd Vendas",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.qty}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "avg",
    label: "Ticket Médio",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.avg}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "percentage",
    label: "Part. %",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.percentage}</span>,
      props: {},
      allProps: true,
    },
  },
];
