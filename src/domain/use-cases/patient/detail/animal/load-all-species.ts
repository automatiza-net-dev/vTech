import { SpecieAnimal } from "./entities";

export type LoadAllSpecies = {
  loadAllSpecies: (
    params: LoadAllSpecies.Params
  ) => Promise<LoadAllSpecies.Model>;
};

export namespace LoadAllSpecies {
  export type Params = {
    description?: string;
  };

  export type Model = SpecieAnimal[];
}
