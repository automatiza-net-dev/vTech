import { Patient, Tutor, ProductCart, Budget, Bill } from "@/domain";

import { DailyMovement } from "../daily-movements";

export type CreateBill = {
  create: (params: CreateBill.Params) => Promise<CreateBill.Model>;
};

export namespace CreateBill {
  export type Params = {
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
