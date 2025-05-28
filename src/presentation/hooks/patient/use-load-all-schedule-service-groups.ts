import { useQuery } from "@/presentation/use-query";

import { container, patientTypes } from "@/container";
import { LoadAllScheduleServicesGroups } from "@/domain";
import { RemoteLoadAllScheduleServicesGroups } from "@/data";

export function useLoadAllScheduleServicesGroups(
  params: LoadAllScheduleServicesGroups.Params
) {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadAllScheduleServicesGroups>(
        patientTypes.RemoteLoadAllScheduleServicesGroups
      )
      .loadAll(params);

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadAllScheduleServicesGroups", params],
    queryFn: fetcher,
    
  });
}
