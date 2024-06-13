import { BusinessUnitProduct, Product, Variation } from "@/domain";

export type Cart = {
  id: Product["id"];
  variations: {
    total: number;
    quantity: number;
    description: string;
    discountValue: number;
    productVariationId: Variation["id"];
    saleValue: BusinessUnitProduct["price"];
    unitaryValue: BusinessUnitProduct["price"];
    maximum_discount_percentage: BusinessUnitProduct["maximum_discount_percentage"];
  }[];
};
