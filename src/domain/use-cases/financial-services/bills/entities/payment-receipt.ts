import { Bill, BusinessUnit, Payment, SystemUser } from "@/domain";

export type PaymentReceipt = {
  id: string;
  tag: Bill["tag"];
  bill_date: Date;
  businessUnit: BusinessUnit;
  payments: Payment[];
  client: SystemUser['user'];
};
