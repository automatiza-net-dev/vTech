import { useRouter } from "next/router";

import { useQuery } from "infinity-forge";
import { useAuthAdmin } from "infinity-forge";

import { RemoteSubgroups } from "@/data";
import { callApiOneTime } from "@/presentation";
import { LoadSubgroupDetails } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useLoadSubgroupDetails(params: LoadSubgroupDetails.Params) {
  const { user } = useAuthAdmin();
  const router = useRouter();


  const userID = user?.user?.id;

  async function fetcher() {
    const response = await container
      .get<RemoteSubgroups>(TypesAutomatiza.RemoteSubgroups)
      .loadDetails({ ...router.query, ...params });

    return response;
  }

  return useQuery({
    queryKey: [
      "RemoteLoadSubgroupDetails",
      JSON.stringify(params),
      router.query.fromDate,
      router.query.toDate,
      userID,
    ],
    queryFn: fetcher,
    
    enabled: !!userID,
  });
}
