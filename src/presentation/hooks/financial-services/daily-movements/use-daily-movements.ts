import { useQuery } from "infinity-forge";

import { RemoteDailyMovements } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllDailyMovements() {
  return useQuery({
    queryKey: ["useDailyMovements"],
    queryFn: async () => {
      const response = await container
        .get<RemoteDailyMovements>(TypesAutomatiza.RemoteDailyMovements)
        .loadAllDailyMovements();

      return response;
    },
    ...callApiOneTime,
  });
}
