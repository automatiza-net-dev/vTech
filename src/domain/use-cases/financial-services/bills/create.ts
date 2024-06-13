
import { Patient, Tutor, ProductCart } from "@/domain";

import { DailyMovement } from "../daily-movements";

export type CreateBill = {
  create: (params: CreateBill.Params) => CreateBill.Model;
};

export namespace CreateBill {
  export type Params = {
    items: ProductCart[];
    clientId: Tutor["id"];
    patientId?: Patient["id"];
    billDate: string;
    budgetId?: string;
    additionalInformation?: string;
    financialResponsibleId?: string;
    dailyMovementId?: DailyMovement["id"];
  };

  export type Model = {};
}
