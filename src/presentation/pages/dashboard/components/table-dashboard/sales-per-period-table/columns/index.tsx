import { Column } from "infinity-forge";
import { Period } from "@/domain";

export const columns: Column<Period>[] = [
  {
    id: "period",
    label: "Total",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.period}</span>,
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
    id: "new",
    label: "Novos",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.new}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "recurrent",
    label: "Recorrentes",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.recurrent}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "percentage",
    label: "Partic. %",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.percentage}</span>,
      props: {},
      allProps: true,
    },
  },
];
