import { Column } from "infinity-forge";
import { PeriodTable } from "../period-table";
import { BudgetsUser } from "@/domain";

export function columns(label: string | undefined): Column<BudgetsUser>[] {
  return [
    {
      id: "name",
      label: label || "Responsável",
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
      width: 100,
      Component: {
        Element: (props) => (
          <PeriodTable {...props.total} index={props.index} />
        ),
        props: {},
        
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
        
      },
    },
  ];
}
