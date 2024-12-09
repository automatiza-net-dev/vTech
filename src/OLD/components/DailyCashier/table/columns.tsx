import Link from "next/link";

import { formatNumberToCurrency } from "infinity-forge";

import { DateToDDMMYYYY } from "@/presentation";

export const columns = [
  {
    label: "Cod",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {props.tag}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "tag",
  },
  {
    label: "Funcionário",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {props?.userWhoOpened?.name}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "user",
  },
  {
    label: "Abertura",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {DateToDDMMYYYY(props.opening_date)}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "opening_date",
  },
  {
    label: "Fechamento",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {DateToDDMMYYYY(props.closing_date) || "Sem data de fechamento"}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "closing_date",
  },
  {
    label: "Saldo",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {formatNumberToCurrency(props.cashier_balance)}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "cashier_balance",
  },
  {
    label: "Conferência",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {DateToDDMMYYYY(props.checking_date) || "Sem data de conferência"}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "checking_date",
  },
  {
    label: "Status",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {props.status}
        </Link>
      ),
      props: {},
      allProps: true,
    },
    id: "status",
  },
];
