import { useRouter } from "next/router";

import { useQuery } from "react-query";
import { useAuthAdmin } from "infinity-forge";

import { RemoteSubgroups } from "@/data";
import { callApiOneTime } from "@/presentation";
import { LoadSubgroupDetails, User } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

export function useLoadSubgroupDetails(params: LoadSubgroupDetails.Params) {
  const { GetUser } = useAuthAdmin();
  const router = useRouter();

  const user = GetUser<User>();
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
    ...callApiOneTime,
    enabled: !!userID,
  });
}
