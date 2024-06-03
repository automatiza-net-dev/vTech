import { Tutor } from "./tutor";

export type LoadAllPatientTutor = {
  loadAll: (params: LoadAllPatientTutor.Params) => Promise<LoadAllPatientTutor.Model>;
};

export namespace LoadAllPatientTutor {
  export type Params = {
    name?: string;
    race?: string;
    phone?: string;
    document?: string;
    patient?: string;
  };

  export type Model = Tutor[];
}
