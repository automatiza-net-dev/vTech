import { useRouter } from "next/router";

import { useQuery } from "infinity-forge";

import { RemoteCommission } from "@/data";
import { container, TypesAutomatiza } from "@/container";

export function useLoadCommissionsConsolidated({ refetch }) {
  const router = useRouter();

  return useQuery({
    queryKey: ["load-commission-consolidated", refetch],
    queryFn: async () => {
      const response = await container
        .get<RemoteCommission>(TypesAutomatiza.RemoteCommission)
        .loadAllCommissionsConsolidated(router.query);

      return response;
    },
  });
}
