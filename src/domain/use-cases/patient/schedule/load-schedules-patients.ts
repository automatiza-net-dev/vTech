import { Tutor } from "@/domain";

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
};

export namespace LoadSchedulesPatient {
  export type Params = {
    name?: string;
    tag?: string;
    tutor?: string;
    phone?: string;
    document?: string;
  };

  export type Model = SchedulePatient[];
}
