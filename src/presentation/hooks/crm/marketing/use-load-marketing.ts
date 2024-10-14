import { useRouter } from "next/router";
import { useQuery } from "infinity-forge";

import { RemoteMarketing } from "@/data";
import { MarketingTypes, container } from "@/container";
import moment from "moment";

export function useLoadMarketing() {
  const router = useRouter();

  const query = router.query as any;

  async function fetcher() {
    const response = await container
      .get<RemoteMarketing>(MarketingTypes.RemoteMarketing)
      .load(query);

    return response.map((res) => {
      return {
        ...res,
        startDate: moment(res.startDate).add(3, "hours").toDate(),
        endDate: moment(res.endDate).add(3, "hours").toDate(),
        clientOriginIdList: res?.clientOrigins?.map((r) => r?.clientOriginId),
      };
    });
  }

  return useQuery({
    queryKey: ["LoadMarketing", JSON.stringify(query || {})],
    queryFn: fetcher,
    enableCache: true,
    enabled: router.isReady,
  });
}
