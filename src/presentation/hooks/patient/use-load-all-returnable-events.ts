import { useQuery } from "@/presentation/use-query";

import { RemoteSchedule } from "@/data";
import { LoadAllReturnableEvents } from "@/domain";
import { container, patientTypes } from "@/container";

export function useLoadAllReturnableEvents(
  params: LoadAllReturnableEvents.Params
) {
  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .loadAllReturnableEvents(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllReturnableEvents", params],
    queryFn: fetcher,
    enabled: !!params?.scheduleId
  });
}
