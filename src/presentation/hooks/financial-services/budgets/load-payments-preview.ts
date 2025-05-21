import { useRouter } from "next/router";

import { useQuery } from "infinity-forge";

import { LoadPaymentsPreview } from "@/domain";
import { RemoteBudget } from "@/data";
import { container, financialServicesTypes } from "@/container";

export function useLoadPaymentsPreview(
  params: LoadPaymentsPreview.Params & { fetch: boolean }
) {
  async function fetcher() {
    if (!params.fetch) {
      return [];
    }

    const response = await container
      .get<RemoteBudget>(financialServicesTypes.RemoteBudget)
      .loadPaymentsPreview(params);
    return response;
  }

  return useQuery({
    queryKey: ["paymentsPreview", params],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
  });
}
