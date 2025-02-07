import { useQuery } from "react-query";

import { RemoteBudget } from "@/data";
import { LoadAllBudgetsAttendance } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllBudgetAttendances(
  props: LoadAllBudgetsAttendance.Params
) {
  return useQuery({
    queryKey: ["LoadAllBudgetAttendances", props.id],
    queryFn: async () => {
      const response = await container
        .get<RemoteBudget>(TypesAutomatiza.RemoteBudget)
        .loadAll(props);

      return response;
    },
    enabled: !!(props?.id)
  });
}
