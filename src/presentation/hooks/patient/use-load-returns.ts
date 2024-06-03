import { useQuery } from "react-query";

import { container, patientTypes } from "@/container";
import { RemoteLoadReturnablesSchedulePatient } from "@/data";

export function useLoadReturnablesSchedulePatient(patientId: string) {
  async function fetcher() {
    const response = await container
      .get<RemoteLoadReturnablesSchedulePatient>(patientTypes.RemoteLoadReturnablesSchedulePatient)
      .load({ patientId });

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadReturnablesSchedulePatient" + patientId,
    queryFn: fetcher,
    enabled: !!(patientId)
  });
}
