import { BusinessUnit } from "./business-unit";

export type LoadAllBusinessUnits = {
  loadAll: () => Promise<LoadAllBusinessUnits.Model>;
};

export namespace LoadAllBusinessUnits {
  export type Model = BusinessUnit[]
}
