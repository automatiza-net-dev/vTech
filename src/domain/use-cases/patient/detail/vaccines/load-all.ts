import { Vaccine } from "./vaccine";

export type LoadAllVaccines = {
  loadAllVaccines: (params: LoadAllVaccines.Params) => Promise<LoadAllVaccines.Model>;
};

export namespace LoadAllVaccines {
  export type Params = {
    patient?: string;
  };

  export type Model = Vaccine[];
}
