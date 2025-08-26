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
      
    },
    id: "closing_date",
  },
  {
    label: "Diferença",
    Component: {
      Element: (props) => (
        <Link href={`/dashboard/movimentacao-caixa/${props.id}`}>
          {props.status === 'ABERTO' ? '-' : formatNumberToCurrency(props.cashier_balance)}
        </Link>
      ),
      props: {},
      
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
      
    },
    id: "status",
  },
];
