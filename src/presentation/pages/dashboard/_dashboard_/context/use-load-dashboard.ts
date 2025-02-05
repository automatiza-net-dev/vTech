import { useRouter } from "next/router";

import { useQuery, api, BadRequestError, useAuthAdmin } from "infinity-forge";

import { Dashboard, LoadDashboard } from "@/domain";
import { RemoteCRM, RemoteDashboard } from "@/data";
import { container, TypesAutomatiza } from "@/container";

export function useLoadDashboard(props: { type?: "crm" | "admin" }) {
  const { user } = useAuthAdmin();

  const router = useRouter();

  async function fetcher() {
    try {
      if (props.type === "admin") {
        const response = await api({ url: "portal/dashboard", method: "get", body: router.query });

        return response as Dashboard
      }

      if (props?.type === "crm") {
        const response = await container
          .get<RemoteCRM>(TypesAutomatiza.RemoteCRM)
          .loadDashboardCRM(router.query);

        return response;
      }

      const response = await container
        .get<RemoteDashboard>(TypesAutomatiza.RemoteDashboard)
        .loadAll(router.query);

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
      props.type,
      user?.user?.id,
      user?.unit?.id,
      router.query.units,
      router.query.toDate,
      router.query.fromDate,
    ],
    queryFn: fetcher,
    enabled: !!(router.query.toDate && router.query.fromDate && router.isReady),
  });
}
