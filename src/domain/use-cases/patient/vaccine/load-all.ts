import { Vaccine } from "@/domain";

export type LoadAllVaccines = {
  loadAllVaccines: (
    params: LoadAllVaccines.Params
  ) => Promise<LoadAllVaccines.Model>;
};

export namespace LoadAllVaccines {
  export type Params = {
    name?: Vaccine["name"];
  };

  export type Model = Vaccine[];
}
