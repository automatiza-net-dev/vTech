import { useQuery } from "infinity-forge";

import { useRouter } from "next/router";

import { Patient } from "@/domain";
import { RemotePatient } from "@/data";
import { container, patientTypes } from "@/container";

export function useLoadPatient(patientId?: Patient["id"]) {
  const router = useRouter();
  const ID = patientId || (router?.query?.id as string);
  const possibleScheduleId = router.query.scheduleId && typeof router.query.scheduleId === 'string' ? router.query.scheduleId : undefined

  async function fetcher() {
    const response = await container
      .get<RemotePatient>(patientTypes.RemotePatient)
      .load({ patientId: ID, scheduleId: possibleScheduleId });

    return response;
  }

  return useQuery({
    queryKey: ["RemotePatient", ID],
    queryFn: fetcher,
    enableCache: true,
    enabled: !!(router.isReady && ID),
  });
}
