import { Bill, UserController } from "@/domain";

export type AuthDiscountPendencySellingBill = {
  authDiscountPendencySellingBill: (
    params: AuthDiscountPendencySellingBill.Params
  ) => Promise<AuthDiscountPendencySellingBill.Model>;
};

export namespace AuthDiscountPendencySellingBill {
  export type Params = {
    billId: Bill["id"];
    itemsIdList: Bill["items"][0]["id"][];
    email: UserController["email"];
    password: UserController["password"];
    reason: string;
    approved: boolean;
  };

  export type Model = {};
}
