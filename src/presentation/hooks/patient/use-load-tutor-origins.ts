import { useQuery } from "react-query";

import { RemoteTutor } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadTutorOrigins() {
  async function fetcher() {
    const response = await container.get<RemoteTutor>(patientTypes.RemoteTutor).loadOrigins();

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadTutorOrigins",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
