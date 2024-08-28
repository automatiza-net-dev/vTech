import { Budget, UserController } from "@/domain";

export type AuthDiscountPendencySellingBudget = {
  authDiscountPendencySellingBudget: (
    params: AuthDiscountPendencySellingBudget.Params
  ) => Promise<AuthDiscountPendencySellingBudget.Model>;
};

export namespace AuthDiscountPendencySellingBudget {
  export type Params = {
    budgetId: Budget["id"];
    itemsIdList: Budget["items"][0]["id"][];
    email: UserController["email"];
    password: UserController["password"];
    reason: string;
    approved: boolean;
  };

  export type Model = {};
}
