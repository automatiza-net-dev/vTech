import { Tutor, Patient } from "@/domain";

export type LoadSchedulesPatient = {
  load: (params: LoadSchedulesPatient.Params) => Promise<LoadSchedulesPatient.Model>;
};

export type SchedulePatient = {
  birthDate: string;
  castrated: boolean;
  gender: "female" | "male";
  id: string;
  name: string;
  tag: string;
  tutors: Tutor[];
  weight: number;
  race?: {
    specie?: {
      description?: string;
    }
  };
};

export namespace LoadSchedulesPatient {
  export type Params = {
    name?: string;
    tag?: string;
    tutor?: string;
    phone?: string;
    document?: string;
    id?: Patient['id'];
  };

  export type Model = SchedulePatient[];
}
