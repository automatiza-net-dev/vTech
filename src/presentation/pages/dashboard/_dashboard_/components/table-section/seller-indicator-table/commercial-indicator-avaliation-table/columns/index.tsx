import { Column } from "infinity-forge";

export const columns: Column<any>[] = [
  {
    id: "qtdAvaliacoes",
    label: "Qtde Planos de Tratamento",
    hasAsc: false,
    width: 20,
    Component: {
      Element: (props) => <span>{props.qtdAvaliacoes || "-"}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "totalAvaliado",
    label: "Total Planos de Tratamento",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props.totalAvaliado || "-"}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "ticketMedioAvaliacoes",
    label: "Ticket Medio Avaliado",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props?.ticketMedioAvaliacoes || "-"}</span>,
      props: {},
      allProps: true,
    },
  },
];
