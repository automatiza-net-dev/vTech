import { useQuery } from "infinity-forge";
import { useRouter } from "next/router";

import { RemoteSchedule } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function useLoadSchedulesMock({
  enabled = false,
}: {
  enabled?: boolean;
}) {
  const router = useRouter();
  const id = router.query.id as string;

  async function fetcher() {
    const response = await container
      .get<RemoteSchedule>(TypesAutomatiza.RemoteSchedule)
      .loadScheduleIdMock({ id });

    return response;
  }

  return useQuery({
    queryKey: ["RemoteSchedulesMock", id],
    queryFn: fetcher,
    enableCache: true,
    enabled: enabled,
  });
}
