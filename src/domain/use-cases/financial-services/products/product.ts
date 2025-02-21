import { Budget } from "../budget";

export type BusinessUnitProduct = {
  id: string;
  businness_unit_id: string;
  stock: number;
  maximum_stock: number;
  minimum_stock: number;
  maximum_discount_percentage: number;
  maximum_discount_value: number;
  price: number;
  cost_price: number;
  profit_margin: number;
  created_at: string;
  updated_at: string;
  product_variation_id: string;
  commission: null;
  meta_type: null;
  meta: null;
  commission_meta: null;
};

export type Variation = {
  id: string;
  product_id: string;
  barcode: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  variationOptions: [];
  product: Product;
  businessUnitProducts: BusinessUnitProduct[];
  kitItems: [];
};

export type Product = {
  id: string;
  cancelledQuantity?: number;
  cancelled?: "P" | "S" | "N" | null;
  approved?: boolean;
  approvalDate?: string;
  courtesy_approved_at?: string;
  max_discount?: boolean;
  economic_group_id: string;
  description: string;
  quantity: string | number;
  type: "product";
  courtesyApprovedUser?: {
    id: string;
    name: string;
  };
  reference_code: string;
  collection_year: null;
  ncm: string;
  cest: null;
  features: null;
  active: boolean;
  created_at: string;
  updated_at: string;
  variation_group_id: string;
  icms_origin: string;
  tax_benefit_code: null;
  anvisa_code: null;
  service_code: null;
  purpose: "both";
  service_type: null;
  fractioned: boolean;
  fraction_value: number;
  sale_value: number;
  unitary_value: number;
  discount_value: number;
  courtesy: boolean;
  total_value: number;
  productVariation: Variation;
  unit: {
    id: string;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    tag: string;
    type: string;
  };
  variations: Variation[];
};

export type ProductCart = {
  quantity: number;
  discountValue: number;
  budgetItemId?: string;
  billItemId?: string;
  approved?: boolean;
  productVariationId: Variation["id"];
  saleValue: BusinessUnitProduct["price"];
  unitaryValue: BusinessUnitProduct["price"];
};
