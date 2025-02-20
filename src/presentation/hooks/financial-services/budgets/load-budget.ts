import { useQuery } from "infinity-forge";

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
      } 
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
          exceedDiscount: item?.max_discount,
          total: item?.total_value,
          quantity: item?.quantity,
          courtesy: item?.courtesy,
          description: item?.productVariation?.product?.description,
          discountValue: item?.discount_value,
          productVariationId: item?.productVariation?.id,
          saleValue: item?.sale_value,
          unitaryValue: item?.unitary_value,
          maximum_discount_percentage:
            item?.productVariation?.businessUnitProducts?.[0]
              ?.maximum_discount_percentage || 0,
        },
      ],
    };
  });
}
