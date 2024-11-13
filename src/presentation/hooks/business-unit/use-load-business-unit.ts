import { useRouter } from "next/router";

import { RemoteBusinessUnits } from "@/data";
import { adminTypes, container } from "@/container";
import { useQuery } from "infinity-forge";

export function useLoadBusinessUnits() {
  const router = useRouter();
  const id = router?.query?.id as string;

  async function fetcher() {
    return await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .load({ id });
  }

  return useQuery({
    queryKey: ["RemoteLoadBusinessUnits", id],
    queryFn: fetcher,
    enabled: !!id,
    enableCache: true,
  });
}
