import { useQuery } from "react-query";

import { RemoteSchedule } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadSchedule(scheduleId) {
  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .load({ scheduleId });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadSchedules", scheduleId],
    queryFn: fetcher,
    ...callApiOneTime,
    enabled: !!(scheduleId)
  });
}
