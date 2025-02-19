import { useQuery } from "react-query";

import { RemoteProduct } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllProducts() {
  return useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const response = await container
        .get<RemoteProduct>(TypesAutomatiza.RemoteProduct)
        .loadAll();
      return response;
    },
  });
}
