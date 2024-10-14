import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { RemoteDre } from "@/data";
import { callApiOneTime } from "@/presentation";
import { TypesAutomatiza, container } from "@/container";

export function useLoadDreReport() {
  const router = useRouter();

  const fetcher = async () => {
    const response = await container
      .get<RemoteDre>(TypesAutomatiza.RemoteDre)
      .loadDreReport(router.query);

    return response;
  };

  return useQuery({
    queryKey: ["DreReport"],
    queryFn: fetcher,
    ...callApiOneTime,
    enabled: false,
  });
}
