import { PaymentMethod } from "../bills";

export type Payment = {
  pending: boolean;
  id: string;
  block: number;
  expiration_date: Date;
  fee_type: "SEM_JUROS";
  fee_value: number;
  fee_percentage: number;
  installment_value: number;
  total_value: number;
  status: null;
  created_at: Date;
  updated_at: Date;
  installments: number;
  nsu_document: 1;
  payment_method_discount_percentage: 0;
  payment_method_discount_value: 0;
  conference_date: null;
  qty_installments: 1;
  finance?: {
    id: string;
    payment_date: string;
    paymentMethod: {
      description: PaymentMethod["description"];
      id: PaymentMethod["id"];
    };
  };
  acquirer: {
    id: string;
    description: string;
  };
  flag: {
    id: string;
    description: string;
    code: string;
    type: "D" | "C" | "A";
  };
  paymentMethod: {
    id: string;
    description: string;
    requires_document: boolean;
    tef: "POS" | "NAO";
    type: "DEBITO" | "CREDITO";
    fee: number;
    automatic_cancellation: boolean;
    days_first_installment: number;
    days_between_installments: number;
    days_until_transfer: number;
    installments_without_password: number;
    max_installments: number;
    allow_change_expiration_date: boolean;
    minimum_installment_value: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    usage: "RECEBER";
    nfe_code: string;
  };
};
