import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { RemotePatient } from "@/data";
import { callApiOneTime } from "@/presentation";
import { container, patientTypes } from "@/container";

export function useLoadPatient() {
  const router = useRouter();
  const patientId = router?.query?.id as string;

  async function fetcher() {
    const response = await container
      .get<RemotePatient>(patientTypes.RemotePatient)
      .load({ patientId });

    return response;
  }

  return useQuery({
    queryKey: ["RemotePatient", patientId],
    queryFn: fetcher,
    ...callApiOneTime,
    enabled: !!(patientId && router.isReady),
  });
}


