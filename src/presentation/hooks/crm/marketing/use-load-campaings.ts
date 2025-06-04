import { useQuery } from "infinity-forge";

import { RemoteMarketing } from "@/data";
import { LoadCampaings } from "@/domain";
import { MarketingTypes, container } from "@/container";

export function useLoadCampaings(params: LoadCampaings.Params) {
  async function fetcher() {
    const response = await container
      .get<RemoteMarketing>(MarketingTypes.RemoteMarketing)
      .loadCampaings(params);

    return response;
  }

  return useQuery({
    queryKey: ["LoadAllMarketing", params?.clientOriginId],
    queryFn: fetcher,
    
  });
}
