import { useQuery } from "infinity-forge";

import { RemoteDailyMovements } from "@/data";
import { SearchDailyMovements } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useSearchDailyMovements(params: SearchDailyMovements.Params) {
  return useQuery({
    enabled: !!params,
    enableCache: true,
    queryKey: ["useSearchDailyMovements", JSON.stringify(params)],
    queryFn: async () => {
      const response = await container
        .get<RemoteDailyMovements>(TypesAutomatiza.RemoteDailyMovements)
        .search(params);

      return response;
    },
  });
}
