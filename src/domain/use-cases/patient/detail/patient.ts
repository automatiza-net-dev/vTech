import { Tutor } from "../tutor";

export type PatientAnimal = {
  id: string;
  death: boolean;
  death_date: string | null;
  microchip: string | null;
  castrated: boolean;
  hair: {
    id: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  race: {
    id: string;
    description: string;
    specie_id: string;
    created_at: string;
    updated_at: string;
    fur: string | null;
    specie: {
      id: string;
      description: string;
      economic_group_id: string | null;
      created_at: string;
      updated_at: string;
    };
  };
};

export type Patient = {
  id: string;
  name: string;
  type: string;
  photo: string | null;
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
  death_date: string;
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
};
