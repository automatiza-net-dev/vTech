import { useQuery } from "react-query";

import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";
import { RemoteLoadAllScheduleStatuses } from "@/data";

export function useLoadAllScheduleStatuses() {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadAllScheduleStatuses>(patientTypes.RemoteLoadAllScheduleStatuses)
      .loadAll({});

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadAllScheduleStatuses",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
