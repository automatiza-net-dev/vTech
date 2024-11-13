import { useRouter } from "next/router";
import { useQuery } from "infinity-forge";

import { RemoteMarketing } from "@/data";
import { MarketingTypes, container } from "@/container";

export function useLoadCampaingsReports() {
  const { query } = useRouter();

  async function fetcher() {
    const response = await container
      .get<RemoteMarketing>(MarketingTypes.RemoteMarketing)
      .loadCampaingsReports(query);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllMarketing", JSON.stringify(query || {})],
    queryFn: fetcher,
    enableCache: true,
  });
}
