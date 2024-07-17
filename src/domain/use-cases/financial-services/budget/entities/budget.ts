import { Product } from "@/domain";

export type Budget = {
  id: string;
  tag: string;
  status: "CONFIRMADO" | "ABERTO" | "NAO_CONFIRMADO__CANCELADO";
  client: {
    id: string;
    name: string;
  };
  total_value: number;
  items: {
    discount_value: number;
    id: string;
    total_value: number;
    quantity: number;
    productVariation: {
      id: string;
      product: Product;
    };
  }[];
};
