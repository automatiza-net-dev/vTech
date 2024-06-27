import { Column } from "infinity-forge";
import { VaccineProtocol } from "@/domain";

import moment from "moment";

export const columns = (title: string): Column<VaccineProtocol>[] => {
  return [
    {
      id: "vaccine",
      label: title,
      hasAsc: false,
      width: 100,
      Component: {
        Element: (props) => <span>{props?.vaccine?.name}</span>,
        props: {},
        allProps: true,
      },
    },
    {
      id: "specie",
      label: "Espécie",
      hasAsc: false,
      width: 100,
      Component: {
        Element: (props) => <span>{props?.specie?.description || "-"}</span>,
        props: {},
        allProps: true,
      },
    },
    {
      id: "name",
      label: "Protocolo",
      hasAsc: false,
      width: 100,
      Component: {
        Element: (props) => <span>{props?.name}</span>,
        props: {},
        allProps: true,
      },
    },
    {
      id: "vaccine",
      label: "Ativa",
      hasAsc: false,
      width: 100,
      Component: {
        Element: (props) => (
          <span>{props?.vaccine?.active ? "Sim" : "false"}</span>
        ),
        props: {},
        allProps: true,
      },
    },
    {
      id: "created_at",
      label: "Data de criação",
      hasAsc: false,
      width: 100,
      Component: {
        Element: (props) => (
          <span>{moment(props?.created_at).format("DD/MM/YYYY")}</span>
        ),
        props: {},
        allProps: true,
      },
    },
  ];
};
