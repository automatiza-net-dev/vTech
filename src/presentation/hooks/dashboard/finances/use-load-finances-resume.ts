import { useQuery } from "react-query";
import { BadRequestError, useAuthAdmin } from "infinity-forge";

import { RemoteFinancesResume } from "@/data";
import { container, dashboardTypes } from "@/container";

export function useLoadFinancesResume() {
  async function fetcher() {
    try {
      const response = await container
        .get<RemoteFinancesResume>(dashboardTypes.RemoteFinancesResume)
        .loadAll({});
      return response;
    } catch (err) {
      if (err instanceof BadRequestError) {
        return [];
      }
    }
  }
  return useQuery({
    queryKey: ["loadFinancesResume"],
    queryFn: fetcher,
  });
}
