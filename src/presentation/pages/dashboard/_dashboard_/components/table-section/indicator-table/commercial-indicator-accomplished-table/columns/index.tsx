import { Column } from "infinity-forge";

export const columns: Column<any>[] = [
  {
    id: "userName",
    label: "Avaliador",
    hasAsc: false,
    width: 100,
    Component: {
      Element: (props) => <span>{props.userName || "-"}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "qtdClientes",
    label: "Qtde Clientes",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props.qtdClientes || "-"}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "valorRealizado",
    label: "Valor Realizado",
    hasAsc: false,
    width: 50,
    Component: {
      Element: (props) => <span>{props.valorRealizado || "-"}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "ticketMedioRealizado",
    label: "Ticket Medio",
    hasAsc: false,
    width: 70,
    Component: {
      Element: (props) => <span>{props.ticketMedioRealizado || "-"}</span>,
      props: {},
      allProps: true,
    },
  },

  {
    id: "participacaoRealizado",
    label: "% Participação das vendas realizadas do período",
    hasAsc: false,
    width: 70,
    Component: {
      Element: (props) => <span>{props.participacaoRealizado}</span>,
      props: {},
      allProps: true,
    },
  },
  {
    id: "conversaoAvaliacoes",
    label: "% Conversão do total Avaliado",
    hasAsc: false,
    width: 70,
    Component: {
      Element: (props) => <span>{props.conversaoAvaliacoes}</span>,
      props: {},
      allProps: true,
    },
  },
];
