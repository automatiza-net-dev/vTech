import { useQuery } from "infinity-forge";

import { RemoteSchedule } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { LoadSyncableScheduleExecutions } from "@/domain";

export function useLoadSyncableScheduleExecutions(
  params: LoadSyncableScheduleExecutions.Params
) {
  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(TypesAutomatiza.RemoteSchedule)
      .loadSyncableExecutions(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadSyncableScheduleExecutions", params],
    queryFn: fetcher,
  });
}
