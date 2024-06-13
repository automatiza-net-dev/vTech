import { useQuery } from "react-query";

import { RemoteBudget } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllProducts() {
  return useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const response = await container
        .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
        .loadAllProducts();
      return response;
    },
    ...callApiOneTime,
  });
}
