import { useQuery } from "react-query";

import { LoadAllReasons } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadAllReasons(type: LoadAllReasons.Params["type"]) {
  async function fetcher() {
    const response = await container
      .get<LoadAllReasons>(patientTypes.RemoteLoadAllReasons)
      .loadAll({ type });

    return response;
  }

  return useQuery({
    queryKey: "RemoteLoadAllReasons",
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
