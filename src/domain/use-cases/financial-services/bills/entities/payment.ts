import { PaymentMethod, User } from "@/domain";

export type Payment = {
  id: string;
  total_value: number;
  printed_at?: null | Date;
  paymentMethod: PaymentMethod;
  printUser?: User;
  block?: number;
  conference_date?: Date | null;
  created_at?: Date;
  expiration_date?: Date;
  fee_percentage?: number;  
};
