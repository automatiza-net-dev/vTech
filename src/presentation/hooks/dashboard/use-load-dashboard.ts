import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { RemoteDashboard } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, dashboardTypes } from "@/container";

export function useLoadDashboard() {
  const router = useRouter();

  async function fetcher() {
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await container
      .get<RemoteDashboard>(dashboardTypes.RemoteDashboard)
      .loadAll({
        type: "AVALIADOR",
        ...router.query,
      });

    return response;
  }
  return useQuery({
    queryKey: ["dasboard", router.query.fromDate, router.query.toDate],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
