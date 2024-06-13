import { useQuery } from "react-query";
import { BadRequestError, useAuthAdmin } from "infinity-forge";

import { RemoteCashiersResume } from "@/data";
import { container, dashboardTypes } from "@/container";

export function useLoadCashiersResume() {
  async function fetcher() {
    try {
      const response = await container
        .get<RemoteCashiersResume>(dashboardTypes.RemoteCashiersResume)
        .loadAll({});
      return response;
    } catch (err) {
      if (err instanceof BadRequestError) {
        return [];
      }
    }
  }
  return useQuery({
    queryKey: ["loadCashiersResume"],
    queryFn: fetcher,
  });
}
