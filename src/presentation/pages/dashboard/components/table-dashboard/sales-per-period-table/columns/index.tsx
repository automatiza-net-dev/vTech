import { Column } from "infinity-forge";
import { PeriodTable } from "../period-table";
import { SalesPerPeriod } from "@/domain";

export const columns: Column<SalesPerPeriod>[] = [
  {
    id: "identification",
    label: "Unidade",
    hasAsc: false,
    width: 100,
  },
  {
    id: "period",
    label: "Manha",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.period.morning} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "period",
    label: "Tarde",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.period.afternoon} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "period",
    label: "Noite",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <PeriodTable {...props.period.night} index={props.index} />
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "period",
    label: "Madrugada",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <>
          <PeriodTable {...props.period.dawn} index={props.index} />
        </>
      ),
      props: {},
      allProps: true,
    },
  },
];
