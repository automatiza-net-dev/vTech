import { BusinessUnit } from "../business-unit";
import { Goal } from "./goal";

export type CreateGoal = {
  create: (params: CreateGoal.Params) => Promise<CreateGoal.Model>;
};

export namespace CreateGoal {
  export type Params = {
    items: {
      value: number;
      metaId: Goal["id"];
      period: Goal["period"];
      businessUnitId: BusinessUnit["id"];
    }[];
  };

  export type Model = {};
}
