import { useRouter } from "next/router";

import { useQuery } from "infinity-forge";

import { RemoteCommission } from "@/data";
import { container, TypesAutomatiza } from "@/container";

export function useLoadCommissionsConference({ refetch }) {
  const router = useRouter();

  return useQuery({
    queryKey: ["load-commission-conference", refetch],
    queryFn: async () => {
      const response = await container
        .get<RemoteCommission>(TypesAutomatiza.RemoteCommission)
        .loadAllCommissionsConference(router.query);

      return response;
    },
  });
}
