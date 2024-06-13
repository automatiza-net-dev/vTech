
import { Attendace, Patient, Tutor, ProductCart } from "@/domain";

import { DailyMovement } from "../daily-movements";

export type CreateBudget = {
  create: (params: CreateBudget.Params) => CreateBudget.Model;
};

export namespace CreateBudget {
  export type Params = {
    budgetDate: string;
    observation: string;
    items: ProductCart[];
    clientId: Tutor["id"];
    expirationDate: string;
    patientId: Patient["id"];
    clientName: Tutor["name"];
    internalObservation: string;
    attendanceId: Attendace["id"];
    dailyMovementId: DailyMovement["id"];
  };

  export type Model = {};
}
