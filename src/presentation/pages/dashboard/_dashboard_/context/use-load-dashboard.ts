import { useQuery } from "@/presentation/use-query";
import { api, BadRequestError } from "infinity-forge";

import { Dashboard, LoadDashboard } from "@/domain";
import { RemoteCRM, RemoteDashboard } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import { useSystem } from "@/presentation/hooks";

export function useLoadDashboard({ type, filters }: { type?: "crm" | "admin", filters: any }) {
  const { user, unit } = useSystem();

  async function fetcher() {
    try {
      if (type === "admin") {
        const response = await api({ url: "portal/dashboard", method: "get", body: filters });

        return response as Dashboard
      }

      if (type === "crm") {
        const response = await container
          .get<RemoteCRM>(TypesAutomatiza.RemoteCRM)
          .loadDashboardCRM(filters);

        return response;
      }

      const response = await container
        .get<RemoteDashboard>(TypesAutomatiza.RemoteDashboard)
        .loadAll(filters);

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
      type,
      user?.id,
      unit?.id,
      JSON.stringify(filters)
    ],
    queryFn: fetcher,
  });
}
