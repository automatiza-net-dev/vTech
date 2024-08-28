import { useQuery } from "infinity-forge";

import { Budget } from "@/domain";
import { RemoteBudget } from "@/data";
import { Cart } from "@/presentation";
import { container, TypesAutomatiza } from "@/container";

export function useLoadBudget({ id }: { id: Budget["id"] }) {
  return useQuery({
    queryKey: ["budget", id],
    queryFn: async () => {
      const response = await container
        .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
        .load({ id });

      const formatItemsBudget = response.items.map((item) => {
        return {
          id: item.productVariation?.product?.id,
          courtesy: item.productVariation?.product?.courtesy,
          variations: [
            {
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

      return { ...response, items: formatItemsBudget as Cart[] };
    },
    enabled: !!id,
  });
}
