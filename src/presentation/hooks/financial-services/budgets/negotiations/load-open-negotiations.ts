import { useRouter } from "next/router";

import { useQuery } from "react-query";

import { Tutor } from "@/domain";
import { RemoteBudget } from "@/data";
import { container, financialServicesTypes } from "@/container";

export function useLoadOpenNegotiations() {
  const router = useRouter();
  const id = (router?.query?.id as string);

  async function fetcher() {
    const response = await container
      .get<RemoteBudget>(financialServicesTypes.RemoteBudget)
      .loadNegotiations({ id });
    return response;
  }

  return useQuery({
    queryKey: ["openNegotiations", id],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
