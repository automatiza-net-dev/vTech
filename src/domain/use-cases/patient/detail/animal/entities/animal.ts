import { Race } from "./race";

export type PatientAnimal = {
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
  race: Race;
};
