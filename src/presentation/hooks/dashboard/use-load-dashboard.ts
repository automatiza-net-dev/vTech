import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { RemoteDashboard } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, dashboardTypes } from "@/container";

import { useAuthAdmin } from "infinity-forge"
import { User } from "@/domain";

export function useLoadDashboard() {

  const { GetUser } = useAuthAdmin()
  const router = useRouter();

  const user = GetUser<User>()

  async function fetcher() {
    const response = await container
      .get<RemoteDashboard>(dashboardTypes.RemoteDashboard)
      .loadAll({
        ...router.query,
      });

    return response;
  }
  return useQuery({
    queryKey: ["dasboard", router.query.fromDate, router.query.toDate, user.user.id],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
