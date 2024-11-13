import { Budget, Payment } from "@/domain";

export type CreateBudgetPayment = {
  createPayment: (
    params: CreateBudgetPayment.Params
  ) => Promise<CreateBudgetPayment.Model>;
};

export namespace CreateBudgetPayment {
  export type Params = {
    budgetId: Budget["id"];
    items: Payment[];
  };

  export type Model = Budget;
}
