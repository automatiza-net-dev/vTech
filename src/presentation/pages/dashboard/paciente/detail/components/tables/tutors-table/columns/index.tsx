import { Column } from "infinity-forge";

import { Tutor } from "@/domain";
import { NameTutor } from "./name-tutor";

export const columns: Column<Tutor>[] = [
  {
    id: "name",
    label: "Nome",
    hasAsc: false,
    width: 300,
    Component: {
      Element: NameTutor,
      props: {},
      
    },
  },
  {
    id: "email",
    label: "Email",
    hasAsc: false,
    width: 300,
    Component: {
      Element: (props) => <div>{props.email}</div>,
      props: {},
      
    },
  },
  {
    id: "tag",
    label: "Tag",
    hasAsc: false,
    width: 80,
    Component: {
      Element: (props) => <div>{props.tag}</div>,
      props: {},
      
    },
  },
  {
    id: "cellphone",
    label: "Celular",
    hasAsc: false,
    width: 200,
    Component: {
      Element: (props) => <div>{props.cellphone}</div>,
      props: {},
      
    },
  },
];
