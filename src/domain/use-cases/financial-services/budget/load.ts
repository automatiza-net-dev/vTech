import { Budget } from "./entities";

export type LoadBudget = {
  load: (params: LoadBudget.Params) => Promise<LoadBudget.Model>;
};

export namespace LoadBudget {
  export type Params = {
    id: Budget["id"];
  };

  export type Model = Budget;
}
