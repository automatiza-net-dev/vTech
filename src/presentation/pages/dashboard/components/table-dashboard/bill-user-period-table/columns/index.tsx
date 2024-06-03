import { Column } from "infinity-forge";
import { PeriodTable } from "../period-table";
import { BillSalesUser } from "@/domain";

export const columns: Column<BillSalesUser>[] = [
  {
    id: "name",
    label: "Nome",
    hasAsc: false,
    width: 100,
  },
  {
    id: "total",
    label: "Total",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <>
          <PeriodTable {...props.total} index={props.index} />
        </>
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "morning",
    label: "Manha",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.morning} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "afternoon",
    label: "Tarde",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.afternoon} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "night",
    label: "Noite",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <PeriodTable {...props.night} index={props.index} />,
      props: {},
      allProps: true,
    },
  },
  {
    id: "dawn",
    label: "Madrugada",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <PeriodTable {...props.dawn} index={props.index} />,
      props: {},
      allProps: true,
    },
  },
];
