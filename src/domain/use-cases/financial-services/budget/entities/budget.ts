import { Patient, Payment, Product } from "@/domain";

export type Budget = {
  id: string;
  tag: string;
  pending: boolean;
  discount_value?: number;
  budget_date?: string;
  internalCode?: string;
  client_name?: string;
  status:
    | "CONFIRMADO"
    | "ABERTO"
    | "NAO_CONFIRMADO__CANCELADO"
    | "Nao Aprovada";
  client: {
    id: string;
    name: string;
  };
  payments: Payment[];
  total_value: number;
  expiration_date: string;
  internalObservation: string;
  observation: string;
  patient: Patient;
  reviewer: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    name: string;
  };
  items: Product[];
};
