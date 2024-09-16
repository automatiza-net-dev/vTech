import { Budget } from "@/domain";

export type DeleteBudgetItem = {
  deleteBudgetItem: (params: DeleteBudgetItem.Params) => Promise<void>;
};

export namespace DeleteBudgetItem {
  export type Params = {
    id: Budget["items"][0]["id"];
  };

  export type Model = {};
}
