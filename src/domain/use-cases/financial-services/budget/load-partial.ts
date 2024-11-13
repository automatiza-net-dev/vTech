import { Budget } from "./entities";

export type LoadPartialBudget = {
  loadPartial: (
    params: LoadPartialBudget.Params
  ) => Promise<LoadPartialBudget.Model>;
};

export namespace LoadPartialBudget {
  export type Params = {
    status: Budget["status"];
    fromCreation: Date;
    fromExpiration: Date;
    tag: Budget["tag"];
    clientName: Budget["client"]["name"];
    patient: Budget["patient"]["name"];
    sellerName: Budget["seller"]["name"];
    pending: Budget["pending"];
  };

  export type Model = Budget[];
}
