import { Budget, BusinessUnitProduct, Product, Variation } from "@/domain";

export type Cart = {
  id: Product["id"];
  courtesy: boolean;
  variations: {
    budgetItemId?: Budget["items"][0]["id"]
    exceedDiscount?: boolean;
    total: number;
    quantity: number;
    courtesy: boolean;
    description: string;
    discountValue: number;
    productVariationId: Variation["id"];
    saleValue: BusinessUnitProduct["price"];
    unitaryValue: BusinessUnitProduct["price"];
    maximum_discount_percentage: BusinessUnitProduct["maximum_discount_percentage"];
  }[];
};




