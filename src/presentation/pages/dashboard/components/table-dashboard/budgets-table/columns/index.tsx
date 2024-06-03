import { Column } from "infinity-forge";
import { PeriodTable } from "../period-table";
import { BudgetsUser } from "@/domain";

export const columns: Column<BudgetsUser>[] = [
  {
    id: "name",
    label: "Aval",
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
      Element: (props) => <PeriodTable {...props.total} index={props.index} />,
      props: {},
      allProps: true,
    },
  },
  {
    id: "confirmed",
    label: "Confirmados",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.confirmed} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "cancelled",
    label: "Cancelados",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.cancelled} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "open",
    label: "Abertos",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <PeriodTable {...props.open} index={props.index} />,
      props: {},
      allProps: true,
    },
  },
];
