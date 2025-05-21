import {
  Bill,
  Budget,
  BusinessUnitProduct,
  Product,
  Variation,
} from "@/domain";

export type CartVariation = {
  id: string;
  approved?: boolean;
  billItemId?: Bill["items"][0]["id"];
  budgetItemId?: Budget["items"][0]["id"];
  exceedDiscount?: boolean;
  total: number;
  quantity: number | string;
  courtesy: boolean;
  description: string;
  discountValue: number;
  productVariationId: Variation["id"];
  saleValue: BusinessUnitProduct["price"];
  unitaryValue: BusinessUnitProduct["price"];
  maximum_discount_percentage: BusinessUnitProduct["maximum_discount_percentage"];

  departmentId: number;
  departmentItemId: number;
  departamentDescription?: string;
}

export type Cart = {
  id: Product["id"];
  courtesy: boolean;
  toSubmit?: boolean;
  hasCourtesy?: boolean;
  authData?: any;
  approved?: Product["approved"];
  approvalDate?: Product["approvalDate"];
  max_discount?: Product["max_discount"];
  courtesyApprovedUser?: Product["courtesyApprovedUser"];
  courtesy_approved_at?: Product["courtesy_approved_at"];
  observation?: string;
  variations: CartVariation[];
};
