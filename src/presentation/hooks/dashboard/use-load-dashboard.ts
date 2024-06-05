import { useRouter } from "next/router";

import { useQuery } from "react-query";
import { BadRequestError, useAuthAdmin } from "infinity-forge";

import { RemoteDashboard } from "@/data";
import { LoadDashboard, User } from "@/domain";
// import { callApiOneTime } from "@/presentation";
import { container, dashboardTypes } from "@/container";

export function useLoadDashboard() {
  const { GetUser } = useAuthAdmin();
  const router = useRouter();

  const user = GetUser<User>();

  async function fetcher() {
    try {
      const response = await container
        .get<RemoteDashboard>(dashboardTypes.RemoteDashboard)
        .loadAll({
          ...router.query,
        });
      return response;
    } catch (err) {
      if (err instanceof BadRequestError) {
        return {
          tables: undefined,
          charts: undefined,
          cards: undefined,
        } as Partial<LoadDashboard.Model>;
      }
    }
  }
  return useQuery({
    queryKey: [
      "dasboard",
      router.query.fromDate,
      router.query.toDate,
      user?.user?.id,
    ],
    queryFn: fetcher,
  });
}
