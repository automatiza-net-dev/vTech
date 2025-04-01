import { Column } from "infinity-forge";
import moment from "moment";

import { ScheduleVaccine } from "@/domain";
import { NameVaccine } from "./name-vaccine";

export const columns: Column<ScheduleVaccine>[] = [
  {
    id: "patient",
    label: "Vacina / Vermífugo",
    hasAsc: false,
    width: 200,
    Component: {
      Element: (props) => <NameVaccine {...props} />,
      props: {},
      
    },
  },
  {
    id: "protocol",
    label: "Protocolo | Qtd. doses | intervalo",
    hasAsc: false,
    width: 300,
    Component: {
      Element: (props) => (
        <div>
          {props.protocol.name} | {props.protocol.doses} |
          {props.protocol.interval}
        </div>
      ),
      props: {},
      
    },
  },
  {
    id: "vaccine",
    label: "Tipo",
    hasAsc: false,
    width: 200,
    Component: {
      Element: (props) => (
        <div>{props?.vaccine?.type === "vaccine" ? "Vacina" : "Vermífugo"}</div>
      ),
      props: {},
      
    },
  },
  {
    id: "created_at",
    label: "Data de criação",
    hasAsc: false,
    width: 200,
    Component: {
      Element: (props) => (
        <div>{moment(props.created_at).format("DD/MM/YYYY")}</div>
      ),
      props: {},
      
    },
  },
  {
    id: "user",
    label: "Responsável",
    hasAsc: false,
    width: 200,
    Component: {
      Element: (props) => <div>{props.user.name}</div>,
      props: {},
      
    },
  },
];
