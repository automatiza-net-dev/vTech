import { useQuery } from "@/presentation/use-query";

import { RemoteSchedule } from "@/data";
import { container, patientTypes } from "@/container";

export function useLoadSchedule(scheduleId) {
  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(patientTypes.RemoteSchedule)
      .load({ scheduleId });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadSchedule", scheduleId],
    queryFn: fetcher,
    enabled: !!scheduleId,
  });
}
