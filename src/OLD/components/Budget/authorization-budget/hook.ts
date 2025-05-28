import { useQuery } from "@/presentation/use-query";

import {
  financialServicesTypes,
  financialServicesContainer,
} from "@/container";
import { RemoteBudget } from "@/data";
import { callApiOneTime } from "@/presentation";

export function useLoadBudget({ id }) {
  async function fetcher() {
    const response = await financialServicesContainer
      .get<RemoteBudget>(financialServicesTypes.RemoteBudget)
      .load({ id });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteLoadBudget", id],
    queryFn: fetcher,
    enableCache: true
  });
}
