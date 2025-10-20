import { Tutor, Patient } from "@/domain";

export type LoadSchedulesPatient = {
  load: (
    params: LoadSchedulesPatient.Params
  ) => Promise<LoadSchedulesPatient.Model>;
};

export type SchedulePatient = {
  description: string; // Verificar tipagem LoadSchedulingToMovement
  start_hour: string; // Verificar tipagem LoadSchedulingToMovement
  birthDate: string;
  castrated: boolean;
  gender: "Macho" | "Femea";
  id: string;
  name: string;
  tag: string;
  tutors: Tutor[];
  weight: number;
  race?: {
    description?: string;
    specie?: {
      description?: string;
    };
  };
};

export namespace LoadSchedulesPatient {
  export type Params = {
    name?: string;
    tag?: string;
    tutor?: string;
    tutorID?: string;
    phone?: string;
    document?: string;
    id?: Patient["id"];
  };

  export type Model = SchedulePatient[];
}
