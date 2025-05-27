import { useQuery } from "infinity-forge";

import { Range } from "@/domain";
import { RemoteMetas } from "@/data";
import { container, metasTypes } from "@/container";

export function useLoadPerfomanceRange(id: Range["metaId"]) {
  async function fetcher() {
    const response = await container
      .get<RemoteMetas>(metasTypes.RemoteMetas)
      .loadPerfomanceRange({ id });

    return response;
  }

  return useQuery({
    queryKey: ["LoadPerfomanceRange", id],
    queryFn: fetcher,
    
    enabled: !!id,
  });
}
