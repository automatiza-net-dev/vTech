import { Budget } from "./entities";

export type ConfirmBudget = {
  confirm: (params: ConfirmBudget.Params) => Promise<{}>;
};

export namespace ConfirmBudget {
  export type Params = {
    id: Budget["id"];
    type: "TOTAL";
    notConfirmedItems: [];
    finishedAt: Date;
    observation?: string;
    internalObservation?: string;
  };
}
