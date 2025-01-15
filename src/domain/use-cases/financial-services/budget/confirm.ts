import { User } from '@/domain'
import { Budget } from "./entities";

export type ConfirmBudget = {
  confirm: (params: ConfirmBudget.Params) => Promise<{}>;
};

export namespace ConfirmBudget {
  export type Params = {
    financialResponsibleId: User['id'];
    id: Budget["id"];
    type: "TOTAL";
    notConfirmedItems: [];
    finishedAt: Date;
    observation?: string;
    internalObservation?: string;
  };
}
