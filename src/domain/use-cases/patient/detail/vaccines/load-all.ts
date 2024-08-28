import { Vaccine } from "@/domain";

export type LoadAllPatientVaccines = {
  loadAllPatientVaccines: (
    params: LoadAllPatientVaccines.Params
  ) => Promise<LoadAllPatientVaccines.Model>;
};

export namespace LoadAllPatientVaccines {
  export type Params = {
    patient?: string;
  };

  export type Model = Vaccine[];
}
