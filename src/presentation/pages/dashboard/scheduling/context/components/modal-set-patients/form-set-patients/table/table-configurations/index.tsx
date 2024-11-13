import { Column } from "infinity-forge";

import { Race } from "./race";
import { Tutors } from "./tutors";
import { BirthDate } from "./birth";
import { ButtonSetSchedulling } from "./button-set-scheduling";

import { Tutor, SchedulePatient } from "@/domain";

export const columns: Column<SchedulePatient & Tutor>[] = [
  {
    id: "name",
    label: "Nome",
    width: 100,
    Component: {
      Element: (props) => props?.name ?? "-",
      props: {},
      allProps: true,
    },
  },
  {
    id: "tag",
    label: "RG",
    width: 20,
    Component: {
      Element: (props) => props.tag ?? "-",
      props: {},
      allProps: true,
    },
  },
  {
    id: "gender",
    label: "Gênero",
    width: 60,
    Component: {
      Element: (props) => (
        <>
          {props.gender ? (props.gender === "female" ? "Fêmea" : "Macho") : "-"}
        </>
      ),
      props: {},
      allProps: true,
    },
  },
  {
    id: "birthDate",
    label: "Dt. Nascimento",
    width: 80,
    Component: {
      Element:  BirthDate,
      props: {},
      allProps: true,
    },
  },
  {
    id: "race",
    label: "Espécie/Raça",
    width: 60,
    Component: {
      Element: Race,
      props: {},
      allProps: true,
    },
  },
  {
    id: "tutors",
    label: "Tutores",
    width: 200,
    Component: {
      Element: (props) => <Tutors tutors={props?.tutors} id={props?.id} name={props?.name} />,
      props: {},
      allProps: true,
    },
  },
  {
    id: "id",
    label: "",
    width: 100,
    Component: {
      Element: ButtonSetSchedulling,
      props: {},
      allProps: true,
    },
  },
];
