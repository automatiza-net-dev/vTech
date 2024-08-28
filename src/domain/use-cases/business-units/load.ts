import { BusinessUnit } from "./business-unit";

export type LoadBusinessUnits = {
  load: () => Promise<LoadBusinessUnits.Model>;
};

export namespace LoadBusinessUnits {
  export type Params = {
    id: BusinessUnit["id"];
  };

  export type Model = BusinessUnit;
}
