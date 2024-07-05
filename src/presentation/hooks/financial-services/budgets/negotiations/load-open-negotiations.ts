import { useRouter } from "next/router";

import { useQuery } from "react-query";

import { RemoteBudget } from "@/data";
import { Tutor } from "@/domain";
import { container, financialServicesTypes } from "@/container";

export function useLoadOpenNegotiations(tutorId?: Tutor["id"]) {
  const router = useRouter();
  const ID = tutorId || (router?.query?.id as string);

  async function fetcher() {
    try {
      const response = await container
        .get<RemoteBudget>(financialServicesTypes.RemoteBudget)
        .loadNegotiations({ id: ID });
      return response;
    } catch (err) {
      throw new Error(
        "Não foi possível buscar as negociações do cliente"
      )
    }
  }
  return useQuery({
    queryKey: ["openNegotiations", tutorId, ID],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
    enabled: !!ID,
  });
}
