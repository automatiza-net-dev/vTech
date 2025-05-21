import { useQuery } from "infinity-forge";

import { LoadOpportunitiesReport } from "@/domain";
import { RemoteCRM } from "@/data";
import { callApiOneTime } from "@/presentation";
import { CrmTypes, container } from "@/container";

export function useLoadOpportunitiesReport(
  params: LoadOpportunitiesReport.Params
) {
  async function fetcher() {
    const response = await container
      .get<RemoteCRM>(CrmTypes.RemoteCRM)
      .loadOpportunitiesReport(params);

    return response;
  }

  return useQuery({
    queryKey: ["opportunitiesReport", params],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
