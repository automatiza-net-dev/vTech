import { useRouter } from "next/router";

import { useQuery } from "infinity-forge";

import { RemoteDre } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useLoadAllDreGroups() {
  const router = useRouter();
  const query = router?.query;

  const fetcher = async () => {
    const response = await container
      .get<RemoteDre>(TypesAutomatiza.RemoteDre)
      .loadAllDreGroups(query);

    return response;
  };

  return useQuery({
    queryKey: ["DreGroups", JSON.stringify(query || {})],
    queryFn: fetcher,
    
    enabled: router.isReady,
  });
}
