import { useQuery } from "react-query";
import { BadRequestError, useAuthAdmin } from "infinity-forge";

import { RemoteIndicators } from "@/data";
import { container, dashboardTypes } from "@/container";
import { useRouter } from "next/router";
import { Indicator } from "@/domain";

export function useLoadIndicators(business_unit_id: string) {

  const { user } = useAuthAdmin()

  const router = useRouter();

  const date = router.query.fromDate as string;

  async function fetcher() {
    try {
      const response = await container
        .get<RemoteIndicators>(dashboardTypes.RemoteIndicators)
        .loadAll({
          periodo: date,
          business_unit_id,
        });
      return response;
    } catch (err) {
      if (err instanceof BadRequestError) {
        return [];
      }
    }
  }
  const result = useQuery({
    queryKey: ["loadIndicators", user?.unit?.id],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: result.isLoading,
    indicators: result?.data as Indicator,
  };
}
