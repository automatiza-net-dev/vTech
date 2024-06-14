import { Race, Specie } from "./entities";

export type LoadAllRaces = {
  loadAllRaces: (params: LoadAllRaces.Params) => Promise<LoadAllRaces.Model>;
};

export namespace LoadAllRaces {
  export type Params = {
    description?: string;
    specie?: Specie["id"];
  };

  export type Model = Race[];
}
