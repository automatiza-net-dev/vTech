import { useQuery } from "@/presentation/use-query";

import * as domain from "@/domain";
import { RemoteSchedule } from "@/data";
import { patientTypes, container } from "@/container";

export function useLoadSynchedTreatmentsItems(
  params: domain.LoadSynchedTreatmentItems.Params
) {
  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .loadSynchedTreatmentItems(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadSynchedTreatmentItems", params?.eventId],
    queryFn: fetcher,
    enabled: !!params?.eventId,
  });
}
