import { Product } from "@/domain";

export type Budget = {
  id: string;
  tag: string;
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
