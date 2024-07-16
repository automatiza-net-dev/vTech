import { Bill, PaymentReceipt, BusinessUnit, Payment } from "@/domain";

export type LoadBillPaymentReceipts = {
  loadBillReceipts: (
    params: LoadBillPaymentReceipts.Params
  ) => Promise<LoadBillPaymentReceipts.Model>;
};

export namespace LoadBillPaymentReceipts {
  export type Params = {
    billId: Bill["id"];
    businessUnitId: BusinessUnit["id"];
    billPaymentId?: Payment["id"];
    blockId?: Payment["block"];
  };

  export type Model = PaymentReceipt[];
}
