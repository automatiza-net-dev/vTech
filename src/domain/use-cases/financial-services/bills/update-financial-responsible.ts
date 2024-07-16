import { Bill, User } from "@/domain";

export type UpdateFinancialResponsible = {
  updateFinancialResponsible: (
    params: UpdateFinancialResponsible.Params
  ) => Promise<UpdateFinancialResponsible.Model>;
};

export namespace UpdateFinancialResponsible {
  export type Params = {
    BillId: Bill["id"];
    financialResponsibleId: User["id"];
  };

  export type Model = {};
}
