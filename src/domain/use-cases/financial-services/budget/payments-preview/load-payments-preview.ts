import { PaymentsPreview, Budget } from "@/domain";

export type LoadPaymentsPreview = {
   loadPaymentsPreview: (
    params: LoadPaymentsPreview.Params
  ) => Promise<LoadPaymentsPreview.Model>;
};

export namespace LoadPaymentsPreview {
  export type Params = {
    budgetId: Budget["id"];
    type?: PaymentsPreview["status"];
  };

  export type Model = PaymentsPreview[];
}
