import { useQuery } from "@/presentation/use-query";

import { RemoteBudget } from "@/data";
import { Cart } from "@/presentation";
import { Budget, Product } from "@/domain";
import { container, TypesAutomatiza } from "@/container";

export function useLoadBudget({ id }: { id: Budget["id"] }) {
  return useQuery({
    queryKey: ["budget", id],
    queryFn: async () => {
      const response = await container
        .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
        .load({ id });

      return {
        ...response,
        items: formatProductsApiToCartItems({ items: response?.items }),
      };
    },
    enabled: !!id,
  });
}

export function formatProductsApiToCartItems({
  items,
}: {
  items?: Product[];
}): Cart[] {
  if (!items || items.length === 0) return [];

  return items.map((item) => {
    return {
      id: item.productVariation?.product?.id,
      hasCourtesy: item?.courtesy,
      courtesy: item.productVariation?.product?.courtesy,
      approved: item?.approved,
      max_discount: item?.max_discount,
      courtesyApprovedUser: item?.courtesyApprovedUser,
      courtesy_approved_at: item?.courtesy_approved_at,
      variations: [
        {
          id: item?.id,
          billItemId: item?.id,
          budgetItemId: item?.id,
          approved: item?.approved,
          exceedDiscount: item?.max_discount,
          total: item?.total_value,
          quantity: item?.quantity,
          courtesy: item?.courtesy,
          description: item?.productVariation?.product?.description,
          discountValue: item?.discount_value,
          productVariationId: item?.productVariation?.id,
          saleValue: item?.sale_value,
          unitaryValue: item?.unitary_value,
          departmentId: item?.department_id,
          departmentItemId: item?.department_item_id,
          departamentDescription: item?.department_item_description,
          maximum_discount_percentage: item?.productVariation?.businessUnitProducts?.[0]?.maximum_discount_percentage || 0,
        },
      ],
    } as any;
  });
}
