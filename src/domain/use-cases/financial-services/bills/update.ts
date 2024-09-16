import { Patient, Tutor, ProductCart, Budget, Bill } from "@/domain";

import { DailyMovement } from "../daily-movements";

export type UpdateBill = {
  create: (params: UpdateBill.Params) => Promise<UpdateBill.Model>;
};

export namespace UpdateBill {
  export type Params = {
    billId: Bill["id"];
    items: ProductCart[];
    clientId: Tutor["id"];
    patientId?: Patient["id"];
    billDate: string;
    budgetId?: Budget["id"];
    additionalInformation?: string;
    financialResponsibleId?: string;
    dailyMovementId?: DailyMovement["id"];
  };

  export type Model = Bill;
}
