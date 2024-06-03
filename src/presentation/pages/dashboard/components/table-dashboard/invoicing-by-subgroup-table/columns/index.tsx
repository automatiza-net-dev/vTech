import { Column } from "infinity-forge";
import { SubgroupInvoicing } from "@/domain";

import { SubgroupDetails } from "../subgroup-details";

export const columns: Column<SubgroupInvoicing>[] = [
  {
    id: "description",
    label: "Subgrupo",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => (
        <span>
          <SubgroupDetails description={props.description} id={props.id} />
        </span>
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "quantity",
    label: "Quantidade",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.quantity}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "total",
    label: "Valor venda",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.total}</span>,
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
