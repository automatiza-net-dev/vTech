import {
  BusinessUnit,
  User,
  Patient,
  Tutor,
  Product,
  Budget,
  Payment,
} from "@/domain";

export type BillItem = Product & {};

export type Bill = {
  id: string;
  bill_date: Date;
  nonPaidValue?: number;
  cancelled?: "P" | "A" | "F" | "S" | "N" | null;
  product_value: number;
  internalCode: string;
  service_value: number;
  origin_bill_id?: string | null;
  discount_value: number;
  fee_value: number | null;
  delivery_value: number;
  total_value: number;
  icms_base: number;
  icms_value: number;
  icms_st_base: number;
  icms_st_value: number;
  iss_base: number;
  iss_value: number;
  pis_base: number;
  pis_value: number;
  pis_retention_value: number;
  cofins_base: number;
  cofins_value: number;
  cofins_retention_value: number;
  ipi_base: number;
  ipi_value: number;
  icms_deferred_value: number;
  icms_fcp_value: number;
  icms_uf_origin_value: number;
  icms_uf_destination_value: number;
  other_value: number;
  additionalInformation: number;
  cancelled_at: Date | null;
  cancellation_observation: null | string;
  status: "BAIXADA" | "ABERTA" | "Venda em Aberto" | "Nao Aprovada";
  document_status: "Gerados" | null;
  created_at: Date;
  updated_at: Date;
  tag: string;
  closing_date: Date;
  paid_value: number;
  businessUnit: BusinessUnit;
  financialResponsible: {
    id: User["id"];
    name: User["user"]["name"];
  };
  seller: User;
  user: User["user"];
  patient: Patient;
  payments: Payment[];
  client: Tutor;
  items: BillItem[];
  budget: {
    id: Budget["id"];
  };
};
