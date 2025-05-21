import { useQuery } from "infinity-forge";

import { RemoteSubgroups } from "@/data";
import { callApiOneTime } from "@/presentation";
import { LoadSubgroups } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useLoadSubgroups(params: LoadSubgroups.Params) {

  async function fetcher() {
    const response = await container
      .get<RemoteSubgroups>(TypesAutomatiza.RemoteSubgroups)
      .loadAll({ ...params });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadSubgroupDetails", JSON.stringify(params)],
    queryFn: fetcher,
    enableCache: true
  });
}
