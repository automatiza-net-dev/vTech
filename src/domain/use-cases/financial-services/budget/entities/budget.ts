import {  Variation, Patient, Product } from "@/domain";

export type Budget = {
  id: string;
  tag: string;
  status: "CONFIRMADO" | "ABERTO" | "NAO_CONFIRMADO__CANCELADO";
  client: {
    id: string;
    name: string;
  };
  total_value: number;
  expiration_date: string;
  internalObservation: string;
  observation: string;
  patient: Patient;
  reviewer: {
    id: string;
    name: string;
  },
  seller: {
    id: string;
    name: string;
  }
  items: {
    saleValue?: number;
    sale_value?: number;
    courtesy?: boolean;
    unitaryValue?: number;
    unitary_value?: number;
    discount_value: number;
    id: string;
    total_value: number;
    quantity: number;
    max_discount: boolean;
    productVariation?: Variation
  }[];
};
