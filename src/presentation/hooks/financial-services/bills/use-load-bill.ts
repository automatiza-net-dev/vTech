import { useQuery } from "@/presentation/use-query";

import { LoadBill } from "@/domain";
import { RemoteBills } from "@/data";
import { container, TypesAutomatiza } from "@/container";

import { formatProductsApiToCartItems } from "../budgets";

export function useLoadBill({ id }: Partial<LoadBill.Params>) {
  return useQuery({
    queryKey: ["load-bill", id],
    queryFn: async () => {
      const response = await container
        .get<RemoteBills>(TypesAutomatiza.RemoteBills)
        .load({ id });

      return {
        ...response,
        products: formatProductsApiToCartItems({ items: response.items }),
      };
    },
    enabled: !!id,
  });
}
