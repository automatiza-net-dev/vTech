import { Tutor } from "../../tutor";
import { PatientAnimal } from "../animal";

export interface PatientHuman {
  active: boolean;
  id: string;
  name: string;
  type: string;
  photo: string | null;
  vaccineOrigin?: string;
  holders?: Tutor[];
  gender: "female" | "male";
  genderText: string;
  tags: string;
  birth_date: string;
  age: string;
  tag: string;
  weight: number;
  weight_date: string;
  hypertension: boolean;
  diabetes: boolean;
  glycemia: null;
  pressure: null;
  firstSale: null;
  isHospitalized: boolean;
  missingBills: string;
  openAttendances: boolean;
  death: boolean;
  deathDate: Date;
  microchip: string;
  castrated: boolean;
  hair: string;
  race: string;
  specie: string;
  specie_id?: string;
  cellphone?: string;
  email?: string;
  tutor: Tutor;
  community: boolean;
  patientAnimal: PatientAnimal;
}

export type Patient = PatientHuman & PatientAnimal;
