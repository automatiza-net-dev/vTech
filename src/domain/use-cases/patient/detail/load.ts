import { Patient } from "./entities/patient";

export type LoadPatient = {
  load: (params: LoadPatient.Params) => Promise<LoadPatient.Model>;
};

export namespace LoadPatient {
  export type Params = {
    patientId: Patient["id"];
    scheduleId?: string
  };

  export type Model = Patient
}
