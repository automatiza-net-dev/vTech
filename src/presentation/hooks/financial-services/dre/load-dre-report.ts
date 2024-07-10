import { useQuery } from "react-query";

import { LoadDreReport } from "@/domain";
import { RemoteDre } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadDreReport(params: LoadDreReport.Params) {
  const fetcher = async () => {
    if (!params.unit) {
      return [];
    }

    const response = await container
      .get<RemoteDre>(TypesAutomatiza.RemoteDre)
      .loadDreReport(params);

    return response;
  };

  return useQuery({
    queryKey: ["DreReport", params],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
