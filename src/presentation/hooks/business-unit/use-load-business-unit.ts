import { useRouter } from "next/router";

import { useQuery } from "react-query";

import { RemoteBusinessUnits } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

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
    ...callApiOneTime,
  });
}
