import { RemoteSchedule } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";
import { useQuery } from "infinity-forge";

export function useLoadSchedules() {
  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(TypesAutomatiza.RemoteSchedule)
      .loadAllSchedulesDashboard({});

    return response;
  }

  return useQuery({
    queryKey: ["RemoteSchedules"],
    queryFn: fetcher,
    enableCache: true
  });
}
