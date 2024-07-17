import { Reason } from "../../patient";
import { Budget } from "./entities";

export type CancelBudget = {
  cancel: (params: CancelBudget.Params) => Promise<{}>;
};

export namespace CancelBudget {
  export type Params = {
    id: Budget["id"]
    finishedAt: Date;
    reasonId: Reason["id"];
    canceledObservation: string;
    internalObservation: string;
  };
}
