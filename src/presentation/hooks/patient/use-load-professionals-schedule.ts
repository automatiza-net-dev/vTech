import { useQuery } from "react-query";

import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";
import { RemoteLoadProfessionalsSchedule } from "@/data";

export function useLoadProfessionalsSchedule() {
  async function fetcher() {
    return await container
      .get<RemoteLoadProfessionalsSchedule>(patientTypes.RemoteLoadProfessionalsSchedule)
      .load();
  }

  return useQuery({
    queryKey: "RemoteLoadProfessionalsSchedule",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
