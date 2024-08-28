import { PaymentsPreview } from "../entities";

export type DeletePaymentPreview = {
  deletePaymentPreview: (params: DeletePaymentPreview.Params) => Promise<void>;
};

export namespace DeletePaymentPreview {
  export type Params = {
    budgetPaymentId: PaymentsPreview["id_orcamento_pgto"];
    origin: "Venda" | "Orçamento";
  };

  export type Model = PaymentsPreview[];
}
