import { useAuthAdmin } from "infinity-forge";
import { useQuery } from "@/presentation/use-query";

import { RemoteMeta } from "@/data";
import { LoadGoal, User } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useLoadGoal(period: LoadGoal.Params["period"]) {
  const { user } = useAuthAdmin();

  async function fetcher() {
    const response = await container
      .get<RemoteMeta>(TypesAutomatiza.RemoteMeta)
      .load({
        period,
        units: [user.unit.id],
        groups: [user.unit.economicGroup.id],
      });

    return response;
  }

  return useQuery({
    queryKey: ["LoadGoal", period],
    queryFn: fetcher,
    enabled: !!period,
  });
}
