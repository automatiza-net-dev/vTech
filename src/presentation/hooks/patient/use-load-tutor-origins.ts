import { useQuery } from "infinity-forge";

import { RemoteTutor } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadTutorOrigins(params = {}) {
  async function fetcher() {
    const response = await container
      .get<RemoteTutor>(patientTypes.RemoteTutor)
      .loadOrigins(params);

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadTutorOrigins", params],
    queryFn: fetcher,
    enableCache: true
  });
}
