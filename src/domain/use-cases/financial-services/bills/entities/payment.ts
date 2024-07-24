import { PaymentMethod, User } from "@/domain";

export type Payment = {
  printed_at?: null | Date;
  paymentMethod: PaymentMethod;
  printUser?: User;
  conference_date?: Date | null;
  finance: {
    payment_date: Date;
    paymentMethod: {
      description: string;
    };
  };
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
  qty_installments: 1;
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
};
