import { Race } from "./race";
import { Tutors } from "./tutors";
import { BirthDate } from "./birth";
import { ButtonSetSchedulling } from "./button-set-scheduling";

export const columnsTable = [
  { id: "name", label: "Nome", width: 100 },
  { id: "tag", label: "RG", width: 20 },
  { id: "gender", label: "Gênero", width: 60,  Component: {
    Element: (props) => props.gender === "female" ? "Fêmea" : "Macho",
    props: { gender: "gender" },
    defaultProps: {},
  },},
  {
    id: "birthDate",
    label: "Aniversário",
    width: 80,
    Component: {
      Element: BirthDate,
      props: { birthDate: "birthDate" },
      defaultProps: {},
    },
  },
  {
    id: "race",
    label: "Espécie/Raça",
    width: 60,
    Component: {
      Element: Race,
      props: { race: "race" },
      defaultProps: {},
    },
  },
  {
    id: "tutores",
    label: "Tutores",
    width: 200,
    Component: {
      Element: Tutors,
      props: { tutors: "tutors", id: "id" },
      defaultProps: {},
    },
  },
  {
    id: "agendamento",
    label: "",
    width: 100,
    Component: {
      Element: ButtonSetSchedulling,
      props: { agendamento: "agendamento" },
      defaultProps: {},
      allProps: true,
    },
  },
];
