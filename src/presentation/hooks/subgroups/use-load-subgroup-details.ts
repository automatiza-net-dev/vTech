import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { RemoteSubgroups } from "@/data";
import { LoadSubgroupDetails } from "@/domain";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadSubgroupDetails({
  needFilterToCallApi = false,
  subgroupFilters,
}: {
  subgroupFilters?: LoadSubgroupDetails.Params | null;
  needFilterToCallApi?: boolean;
}) {
  const router = useRouter();

  async function fetcher() {
    const response = await container
      .get<RemoteSubgroups>(TypesAutomatiza.RemoteSubgroups)
      .loadDetails({ ...router.query, ...subgroupFilters });

    return response;
  }

  return useQuery({
    queryKey: [
      "RemoteLoadSubgroupDetails",
      subgroupFilters,
      router.query.fromDate,
      router.query.toDate,
    ],
    queryFn: fetcher,
    ...callApiOneTime,
    enabled: needFilterToCallApi ? !!subgroupFilters : true,
  });
}
