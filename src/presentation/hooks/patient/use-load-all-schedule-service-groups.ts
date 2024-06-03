import { useQuery } from "react-query";

import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";
import { RemoteLoadAllScheduleServicesGroups } from "@/data";

export function useLoadAllScheduleServicesGroups() {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadAllScheduleServicesGroups>(patientTypes.RemoteLoadAllScheduleServicesGroups)
      .loadAll({});

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadAllScheduleServicesGroups",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
